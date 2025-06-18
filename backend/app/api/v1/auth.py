from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from ...core.database import get_db
from ...core.security import create_access_token, create_refresh_token, verify_token
from ...crud.user import user_crud
from ...schemas.auth import Token, LoginRequest, RefreshTokenRequest, ErrorResponse
from ...schemas.user import UserCreate, UserResponse
from ...core.config import settings

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


@router.post("/login", response_model=Token)
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

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


@router.post("/refresh", response_model=Token)
def refresh_token(token_data: RefreshTokenRequest, db: Session = Depends(get_db)):
    payload = verify_token(token_data.refresh_token)
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
    new_refresh_token = create_refresh_token(data={"sub": user.username})

    return {
        "access_token": access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer"
    }
