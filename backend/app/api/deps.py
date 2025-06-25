from typing import Optional
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..core.security import verify_token
from ..crud.user import user_crud
from ..models.user import User

# Create HTTPBearer with auto_error=False to prevent automatic 403 errors
security = HTTPBearer(auto_error=False)


def get_current_user(
        request: Request,
        db: Session = Depends(get_db),
        # Now this won't raise an error if no Authorization header is present
        header_credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> User:
    token = None

    # 1. Try to get token from Authorization: Bearer header
    if header_credentials:
        token = header_credentials.credentials
        print(f"DEBUG: Token found in Authorization header: {token[:10]}...")

    # 2. If no token found in header, try to get it from cookie
    if not token:
        token = request.cookies.get("access_token")
        if token:
            print(f"DEBUG: Token found in 'access_token' cookie: {token[:10]}...")
        else:
            print("DEBUG: No access_token found in Authorization header or Cookie.")

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token missing",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = verify_token(token)
    if payload is None:
        print("DEBUG: Token verification failed")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    username: str = payload.get("sub")
    if username is None:
        print("DEBUG: Token payload missing 'sub' claim.")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials: missing username",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = user_crud.get_user_by_username_or_email(db, username)
    if user is None:
        print(f"DEBUG: User not found for username/email: {username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    print(f"DEBUG: Successfully found user: {user.username}")
    return user


def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    if not user_crud.is_active(current_user):
        print(f"DEBUG: User {current_user.username} is inactive.")
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Inactive user")
    print(f"DEBUG: User {current_user.username} is active.")
    return current_user


def get_current_admin_user(current_user: User = Depends(get_current_active_user)) -> User:
    if not current_user.is_superuser:
        print(f"DEBUG: User {current_user.username} is not admin.")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
    print(f"DEBUG: User {current_user.username} is admin.")
    return current_user
