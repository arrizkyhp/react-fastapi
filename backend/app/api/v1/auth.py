from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from ...core.database import get_db
from ...core.security import create_access_token, create_refresh_token, verify_token
from ...crud.user import user_crud
from ...schemas.auth import Token, LoginRequest, RefreshTokenRequest, ErrorResponse
from ...schemas.user import UserCreate, UserResponse
from ...core.config import settings

from ..deps import get_current_active_user
from ...models.user import User as DBUser

router = APIRouter()


@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    db_user = user_crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=ErrorResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                error_type="registration_error",
                detail="Email already registered"
            ).model_dump()
        )

    db_user = user_crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=ErrorResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                error_type="registration_error",
                detail="Username already taken"
            ).model_dump()
        )

    return user_crud.create_user(db=db, user=user)


@router.post("/login", response_model=dict)
def login(user_credentials: LoginRequest, db: Session = Depends(get_db)):
    user = user_crud.authenticate(
        db, username=user_credentials.username, password=user_credentials.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=ErrorResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                error_type="authentication_error",
                detail="Incorrect username or password"
            ).model_dump(),
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user_crud.is_active(user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=ErrorResponse(
                status_code=status.HTTP_403_FORBIDDEN,
                error_type="account_error",
                detail="Inactive user account"
            ).model_dump()
        )

    access_token = create_access_token(data={"sub": user.username})
    refresh_token = create_refresh_token(data={"sub": user.username})

    response_content = {"message": "Login successful!"}

    response = JSONResponse(content=response_content)

    # Set Access Token as an HttpOnly cookie
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,  # Make it HttpOnly
        secure=settings.ENVIRONMENT == "production",  # Only True in production for HTTPS
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,  # max_age in seconds
        samesite="lax",  # Important for CSRF protection
        path="/",  # Make it available to all paths
        domain=settings.BACKEND_HOST_FOR_COOKIES
    )

    # Set Refresh Token as an HttpOnly cookie
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,  # Make it HttpOnly
        secure=settings.ENVIRONMENT == "production",
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,  # max_age in seconds
        samesite="lax",
        path="/",  # Make it available to all paths for simplicity
        domain=settings.BACKEND_HOST_FOR_COOKIES
    )

    return response


@router.post("/refresh", response_model=dict)
def refresh_token(request: Request, db: Session = Depends(get_db)):
    # Get refresh token from cookies
    refresh_token_cookie = request.cookies.get("refresh_token")
    if not refresh_token_cookie:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=ErrorResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                error_type="token_error",
                detail="Refresh token missing from cookies"
            ).model_dump()
        )

    # Use the token from the cookie for verification
    payload = verify_token(refresh_token_cookie)  # <--- Use refresh_token_cookie
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=ErrorResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                error_type="token_error",
                detail="Invalid refresh token"
            ).model_dump()
        )

    username: str = payload.get("sub")
    if username is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=ErrorResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                error_type="token_error",
                detail="Invalid refresh token: missing username"
            ).model_dump()
        )

    user = user_crud.get_user_by_username_or_email(db, username)
    if user is None or not user_crud.is_active(user):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=ErrorResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                error_type="account_error",
                detail="Invalid refresh token: user not found or inactive"
            ).model_dump()
        )

    access_token = create_access_token(data={"sub": user.username})
    new_refresh_token = create_refresh_token(data={"sub": user.username})  # Refresh token rotation

    # Prepare the JSON response content
    response_content = {"message": "Tokens refreshed!"}

    response = JSONResponse(content=response_content)

    # Set new Access Token cookie
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=settings.ENVIRONMENT == "production",
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        samesite="lax",
        path="/",
        domain=settings.BACKEND_HOST_FOR_COOKIES
    )

    # Set new Refresh Token cookie (for rotation)
    response.set_cookie(
        key="refresh_token",
        value=new_refresh_token,
        httponly=True,
        secure=settings.ENVIRONMENT == "production",
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        samesite="lax",
        path="/",
        domain=settings.BACKEND_HOST_FOR_COOKIES
    )
    return response


@router.post("/logout")
def logout(current_user: DBUser = Depends(get_current_active_user)):
    """
    Handles user logout by instructing the browser to delete the authentication cookies.
    """
    response_content = {"message": "Successfully logged out"}
    response = JSONResponse(content=response_content)

    # Delete the access_token cookie
    response.delete_cookie(
        key="access_token",
        path="/",  # Must match the path where it was set
        samesite="lax",  # Must match the samesite where it was set
        secure=settings.ENVIRONMENT == "production",  # Must match secure setting
        domain = settings.BACKEND_HOST_FOR_COOKIES
    )

    # Delete the refresh_token cookie
    response.delete_cookie(
        key="refresh_token",
        path="/",  # Must match the path where it was set
        samesite="lax",
        secure=settings.ENVIRONMENT == "production",
        domain=settings.BACKEND_HOST_FOR_COOKIES
    )

    return response

