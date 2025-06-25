from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session
from typing import Optional

from ..deps import get_current_active_user, get_current_superuser
from ...core.database import get_db
from ...crud.audit_log import audit_log_crud
from ...models.user import User
from ...schemas.audit_log import (
    AuditLogListResponse,
    AuditLogResponse,
    AuditLogFilters,
    PaginationMetadata
)

router = APIRouter()


@router.get("/audit-logs", response_model=AuditLogListResponse)
def get_audit_logs(
        request: Request,
        page: int = Query(1, ge=1, description="Page number"),
        per_page: int = Query(10, ge=1, le=100, description="Items per page"),
        entity_type: Optional[str] = Query(None, description="Filter by entity type"),
        entity_id: Optional[int] = Query(None, description="Filter by entity ID"),
        action_type: Optional[str] = Query(None, description="Filter by action type"),
        user_id: Optional[int] = Query(None, description="Filter by user ID"),
        search: Optional[str] = Query(None, description="General search query"),
        from_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
        to_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
        sort_by: Optional[str] = Query("timestamp", description="Sort by field"),
        sort_order: Optional[str] = Query("desc", description="Sort order (asc/desc)"),
        current_user: User = Depends(get_current_superuser),  # Require superuser for audit logs
        db: Session = Depends(get_db)
):
    """
    Get paginated audit logs with filtering and sorting.
    Requires superuser permissions.
    """

    # Validate date format if provided
    if from_date or to_date:
        from datetime import datetime
        try:
            if from_date:
                datetime.strptime(from_date, "%Y-%m-%d")
            if to_date:
                datetime.strptime(to_date, "%Y-%m-%d")
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="Invalid date format. Use YYYY-MM-DD."
            )

    # Validate sort parameters
    valid_sort_fields = ["timestamp", "date", "user", "action", "entity"]
    valid_sort_orders = ["asc", "desc"]

    if sort_by not in valid_sort_fields:
        sort_by = "timestamp"
    if sort_order not in valid_sort_orders:
        sort_order = "desc"

    # Create filters object
    filters = AuditLogFilters(
        entity_type=entity_type,
        entity_id=entity_id,
        action_type=action_type,
        user_id=user_id,
        search=search,
        from_date=from_date,
        to_date=to_date,
        sort_by=sort_by,
        sort_order=sort_order
    )

    # Get audit logs with pagination
    audit_logs, pagination_metadata = audit_log_crud.get_audit_logs(
        db=db,
        page=page,
        per_page=per_page,
        filters=filters
    )

    # Convert to response format
    audit_log_responses = []
    for log in audit_logs:
        log_dict = log.to_dict()
        audit_log_responses.append(AuditLogResponse(**log_dict))

    return AuditLogListResponse(
        items=audit_log_responses,
        pagination=PaginationMetadata(**pagination_metadata)
    )


@router.get("/audit-logs/{audit_log_id}", response_model=AuditLogResponse)
def get_audit_log(
        audit_log_id: int,
        current_user: User = Depends(get_current_superuser),
        db: Session = Depends(get_db)
):
    """
    Get a specific audit log by ID.
    Requires superuser permissions.
    """
    audit_log = audit_log_crud.get_audit_log(db, audit_log_id)
    if not audit_log:
        raise HTTPException(status_code=404, detail="Audit log not found")

    log_dict = audit_log.to_dict()
    return AuditLogResponse(**log_dict)


# Optional: Get audit logs for current user only (non-superuser endpoint)
@router.get("/my-audit-logs", response_model=AuditLogListResponse)
def get_my_audit_logs(
        request: Request,
        page: int = Query(1, ge=1, description="Page number"),
        per_page: int = Query(10, ge=1, le=100, description="Items per page"),
        entity_type: Optional[str] = Query(None, description="Filter by entity type"),
        action_type: Optional[str] = Query(None, description="Filter by action type"),
        from_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
        to_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
        sort_by: Optional[str] = Query("timestamp", description="Sort by field"),
        sort_order: Optional[str] = Query("desc", description="Sort order (asc/desc)"),
        current_user: User = Depends(get_current_active_user),
        db: Session = Depends(get_db)
):
    """
    Get audit logs for the current user only.
    Regular users can only see their own audit logs.
    """

    # Validate parameters (similar to main endpoint)
    if from_date or to_date:
        from datetime import datetime
        try:
            if from_date:
                datetime.strptime(from_date, "%Y-%m-%d")
            if to_date:
                datetime.strptime(to_date, "%Y-%m-%d")
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="Invalid date format. Use YYYY-MM-DD."
            )

    valid_sort_fields = ["timestamp", "date", "action", "entity"]
    valid_sort_orders = ["asc", "desc"]

    if sort_by not in valid_sort_fields:
        sort_by = "timestamp"
    if sort_order not in valid_sort_orders:
        sort_order = "desc"

    # Create filters object with user_id fixed to current user
    filters = AuditLogFilters(
        entity_type=entity_type,
        action_type=action_type,
        user_id=current_user.id,  # Force filter to current user
        from_date=from_date,
        to_date=to_date,
        sort_by=sort_by,
        sort_order=sort_order
    )

    # Get audit logs with pagination
    audit_logs, pagination_metadata = audit_log_crud.get_audit_logs(
        db=db,
        page=page,
        per_page=per_page,
        filters=filters
    )

    # Convert to response format
    audit_log_responses = []
    for log in audit_logs:
        log_dict = log.to_dict()
        audit_log_responses.append(AuditLogResponse(**log_dict))

    return AuditLogListResponse(
        items=audit_log_responses,
        pagination=PaginationMetadata(**pagination_metadata)
    )