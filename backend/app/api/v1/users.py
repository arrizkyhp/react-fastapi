from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional, Dict, Any, Union

from ..deps import get_current_active_user, get_current_admin_user
from ...core.database import get_db
from ...crud.user import user_crud
from ...models.user import User
from ...schemas.user import UserResponse, UserUpdate
from ...schemas.common import PaginatedResponse, PaginationMetadata

router = APIRouter()

@router.get("/", response_model=Union[PaginatedResponse[UserResponse], PaginatedResponse[UserResponse]])
def read_users(
        page: int = Query(1, ge=1, description="Page number"),
        per_page: int = Query(10, ge=1, le=100, description="Items per page"),
        get_all: bool = Query(False, description="Get all users without pagination"),
        status_filter: Optional[str] = Query(None, description="Filter by user status"),
        name_search: Optional[str] = Query(None, description="Search by username or full name"),
        email_search: Optional[str] = Query(None, description="Search by email"),
        role_filter: Optional[str] = Query(None, description="Filter by user role"),
        include_profile: bool = Query(False, description="Include profile details"),
        include_audit_logs: bool = Query(False, description="Include recent audit logs"),
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_admin_user)
):
    """
    Get users with comprehensive filtering and pagination options.
    """

    # Start with base query
    query = db.query(User)

    # Apply filters based on query parameters
    if status_filter:
        query = query.filter(User.status == status_filter)

    if name_search:
        query = query.filter(
            func.lower(User.username).contains(name_search.lower()) |
            func.lower(User.full_name).contains(name_search.lower())
        )

    if email_search:
        query = query.filter(func.lower(User.email).contains(email_search.lower()))

    if role_filter:
        query = query.filter(User.role == role_filter)

    # Handle get_all case (no pagination)
    if get_all:
        users = query.all()
        total_count = len(users)

        # Convert to response format
        json_users = []
        for user in users:
            user_dict = user_to_dict(
                user,
                include_profile=include_profile,
                include_audit_logs=include_audit_logs,
                db=db
            )
            json_users.append(UserResponse(**user_dict))

        return PaginatedResponse[UserResponse](items=json_users, total_count=total_count)

    # Handle pagination
    total_items = query.count()
    total_pages = (total_items + per_page - 1) // per_page

    # Apply pagination
    offset = (page - 1) * per_page
    users = query.offset(offset).limit(per_page).all()

    # Convert to response format
    json_users = []
    for user in users:
        user_dict = user_to_dict(
            user,
            include_profile=include_profile,
            include_audit_logs=include_audit_logs,
            db=db
        )
        json_users.append(UserResponse(**user_dict))

    # Create pagination metadata
    pagination_metadata = PaginationMetadata(
        total_items=total_items,
        total_pages=total_pages,
        current_page=page,
        per_page=per_page,
        has_next=page < total_pages,
        has_prev=page > 1,
        next_num=page + 1 if page < total_pages else None,
        prev_num=page - 1 if page > 1 else None,
    )

    return PaginatedResponse[UserResponse](items=json_users, pagination=pagination_metadata)


def user_to_dict(
        user: User,
        include_profile: bool = False,
        include_audit_logs: bool = False,
        db: Session = None
) -> Dict[str, Any]:
    """Convert User model to dictionary with optional additional details."""
    user_dict = {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "full_name": getattr(user, 'full_name', None),
        "status": getattr(user, 'status', None),
        "role": getattr(user, 'role', None),
        "created_at": user.created_at.isoformat() if hasattr(user, 'created_at') and user.created_at else None,
        "updated_at": user.updated_at.isoformat() if hasattr(user, 'updated_at') and user.updated_at else None,
    }

    if include_profile and hasattr(user, 'profile'):
        user_dict["profile"] = {
            "phone": getattr(user.profile, 'phone', None),
            "address": getattr(user.profile, 'address', None),
            "bio": getattr(user.profile, 'bio', None),
        }

    if include_audit_logs and db:
        from ...models.audit_log import AuditLog

        recent_logs = db.query(AuditLog).filter(
            AuditLog.user_id == user.id
        ).order_by(AuditLog.timestamp.desc()).limit(5).all()

        user_dict["recent_audit_logs"] = [
            {
                "id": log.id,
                "action_type": log.action_type,
                "entity_type": log.entity_type,
                "entity_id": log.entity_id,
                "timestamp": log.timestamp.isoformat() if log.timestamp else None,
                "description": log.description,
            }
            for log in recent_logs
        ]

    return user_dict


@router.get("/me", response_model=UserResponse)
def read_user_me(current_user: User = Depends(get_current_active_user)):
    return current_user

@router.put("/me", response_model=UserResponse)
def update_user_me(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    updated_user = user_crud.update_user(db, current_user.id, user_update)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user
