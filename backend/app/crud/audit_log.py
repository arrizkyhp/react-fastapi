from sqlalchemy.orm import Session
from sqlalchemy import desc, or_, and_
from typing import Optional, Tuple, List
from datetime import datetime, timezone
import math

from app.models.audit_log import AuditLog
from app.models.user import User
from app.schemas.audit_log import AuditLogCreate, AuditLogFilters


class AuditLogCRUD:
    def create_audit_log(self, db: Session, audit_log: AuditLogCreate) -> AuditLog:
        db_audit_log = AuditLog(**audit_log.model_dump())
        db.add(db_audit_log)
        db.commit()
        db.refresh(db_audit_log)
        return db_audit_log

    def get_audit_logs(
            self,
            db: Session,
            page: int = 1,
            per_page: int = 10,
            filters: Optional[AuditLogFilters] = None
    ) -> Tuple[List[AuditLog], dict]:
        """
        Get paginated audit logs with filtering and sorting.
        Returns tuple of (audit_logs, pagination_metadata)
        """
        # Base query with User join
        query = db.query(AuditLog).join(User, AuditLog.user_id == User.id, isouter=True)

        # Apply filters if provided
        if filters:
            query = self._apply_filters(query, filters)

        # Apply sorting
        if filters and filters.sort_by and filters.sort_order:
            query = self._apply_sorting(query, filters.sort_by, filters.sort_order)
        else:
            query = query.order_by(desc(AuditLog.timestamp))

        # Calculate pagination
        total_items = query.count()
        total_pages = math.ceil(total_items / per_page)
        offset = (page - 1) * per_page

        # Get paginated results
        audit_logs = query.offset(offset).limit(per_page).all()

        # Prepare pagination metadata
        pagination_metadata = {
            "total_items": total_items,
            "total_pages": total_pages,
            "current_page": page,
            "per_page": per_page,
            "has_next": page < total_pages,
            "has_prev": page > 1,
            "next_num": page + 1 if page < total_pages else None,
            "prev_num": page - 1 if page > 1 else None,
        }

        return audit_logs, pagination_metadata

    def _apply_filters(self, query, filters: AuditLogFilters):
        """Apply filters to the query"""
        if filters.entity_type:
            query = query.filter(AuditLog.entity_type.ilike(f"%{filters.entity_type}%"))

        if filters.entity_id:
            query = query.filter(AuditLog.entity_id == filters.entity_id)

        if filters.action_type:
            query = query.filter(AuditLog.action_type.ilike(f"%{filters.action_type}%"))

        if filters.user_id:
            query = query.filter(User.id == filters.user_id)

        # Apply date range filtering
        if filters.from_date:
            try:
                from_date = datetime.strptime(filters.from_date, "%Y-%m-%d").replace(
                    tzinfo=timezone.utc
                )
                query = query.filter(AuditLog.timestamp >= from_date)
            except ValueError:
                # Invalid date format - could raise HTTPException here
                pass

        if filters.to_date:
            try:
                to_date = (
                    datetime.strptime(filters.to_date, "%Y-%m-%d")
                    .replace(hour=23, minute=59, second=59, microsecond=999999)
                    .replace(tzinfo=timezone.utc)
                )
                query = query.filter(AuditLog.timestamp <= to_date)
            except ValueError:
                # Invalid date format - could raise HTTPException here
                pass

        # Apply search query
        if filters.search:
            search_term = f"%{filters.search}%"
            query = query.filter(
                or_(
                    User.username.ilike(search_term),
                    AuditLog.description.ilike(search_term),
                    AuditLog.entity_type.ilike(search_term),
                    AuditLog.field_name.ilike(search_term),
                )
            )

        return query

    def _apply_sorting(self, query, sort_by: str, sort_order: str):
        """Apply sorting to the query"""
        if sort_by == "date" or sort_by == "timestamp":
            order_column = AuditLog.timestamp
        elif sort_by == "user":
            order_column = User.username
        elif sort_by == "action":
            order_column = AuditLog.action_type
        elif sort_by == "entity":
            order_column = AuditLog.entity_type
        else:
            order_column = AuditLog.timestamp

        if sort_order == "desc":
            query = query.order_by(desc(order_column))
        else:
            query = query.order_by(order_column)

        return query

    def get_audit_log(self, db: Session, audit_log_id: int) -> Optional[AuditLog]:
        return db.query(AuditLog).filter(AuditLog.id == audit_log_id).first()


audit_log_crud = AuditLogCRUD()