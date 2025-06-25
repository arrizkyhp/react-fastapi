from sqlalchemy.orm import Session
from fastapi import Request
from typing import Optional, Any
import json
import logging

from app.models.audit_log import AuditLog
from app.models.user import User

logger = logging.getLogger(__name__)


def log_audit_event(
        db: Session,
        action_type: str,
        entity_type: str,
        entity_id: Optional[int] = None,
        field_name: Optional[str] = None,
        old_value: Optional[Any] = None,
        new_value: Optional[Any] = None,
        description: Optional[str] = None,
        user_id: Optional[int] = None,
        request: Optional[Request] = None
) -> Optional[AuditLog]:
    """
    Logs an audit event to the database.

    Args:
        db: Database session
        action_type: Type of action (e.g., 'CREATE', 'UPDATE', 'DELETE', 'LOGIN')
        entity_type: The type of entity affected (e.g., 'Category', 'Permission')
        entity_id: The ID of the specific entity instance affected
        field_name: The name of the field that was changed (for 'UPDATE')
        old_value: The value of the field/entity before the change
        new_value: The value of the field/entity after the change
        description: A human-readable description of the event
        user_id: ID of the user performing the action
        request: FastAPI Request object to extract IP and User-Agent

    Returns:
        AuditLog: The created audit log entry, or None if creation failed
    """

    # Extract request information
    ip_address = 'N/A'
    user_agent = 'N/A'

    if request:
        # Get client IP, considering potential proxies
        ip_address = (
            request.headers.get('X-Forwarded-For', '').split(',')[0].strip() or
            request.headers.get('X-Real-IP', '') or
            request.client.host if request.client else 'N/A'
        )
        user_agent = request.headers.get('User-Agent', 'N/A')

    # Convert old_value/new_value to JSON strings
    old_value_str = None
    new_value_str = None

    if old_value is not None:
        try:
            old_value_str = json.dumps(old_value, default=str)
        except (TypeError, ValueError) as e:
            logger.warning(f"Failed to serialize old_value: {e}")
            old_value_str = str(old_value)

    if new_value is not None:
        try:
            new_value_str = json.dumps(new_value, default=str)
        except (TypeError, ValueError) as e:
            logger.warning(f"Failed to serialize new_value: {e}")
            new_value_str = str(new_value)

    # Construct a default description if not provided
    if not description:
        description = _generate_default_description(
            action_type, entity_type, entity_id, field_name,
            old_value_str, new_value_str
        )

    # Create audit log entry
    audit_log_entry = AuditLog(
        user_id=user_id,
        action_type=action_type,
        entity_type=entity_type,
        entity_id=entity_id,
        field_name=field_name,
        old_value=old_value_str,
        new_value=new_value_str,
        description=description,
        ip_address=ip_address,
        user_agent=user_agent
    )

    try:
        db.add(audit_log_entry)
        db.commit()
        db.refresh(audit_log_entry)
        return audit_log_entry
    except Exception as e:
        db.rollback()
        logger.error(f"Error logging audit event: {e}", exc_info=True)
        return None


def _generate_default_description(
        action_type: str,
        entity_type: str,
        entity_id: Optional[int],
        field_name: Optional[str],
        old_value_str: Optional[str],
        new_value_str: Optional[str]
) -> str:
    """Generate a default description for audit log entry"""

    if action_type == 'CREATE':
        return f"Created {entity_type} (ID: {entity_id})"

    elif action_type == 'UPDATE':
        if field_name and old_value_str and new_value_str:
            try:
                old_display = json.loads(old_value_str)
                new_display = json.loads(new_value_str)
            except (json.JSONDecodeError, TypeError):
                old_display = old_value_str
                new_display = new_value_str

            # Convert complex objects to string representation
            if isinstance(old_display, dict):
                old_display = json.dumps(old_display)
            if isinstance(new_display, dict):
                new_display = json.dumps(new_display)

            return (
                f"Updated {entity_type} (ID: {entity_id}) - "
                f"'{field_name}' changed from '{old_display}' to '{new_display}'"
            )
        else:
            return f"Updated {entity_type} (ID: {entity_id})"

    elif action_type == 'DELETE':
        return f"Deleted {entity_type} (ID: {entity_id})"

    else:
        return f"{action_type} action on {entity_type}"


# Convenience function for common audit logging scenarios
async def audit_user_action(
        db: Session,
        request: Request,
        action_type: str,
        entity_type: str,
        entity_id: Optional[int] = None,
        field_name: Optional[str] = None,
        old_value: Optional[Any] = None,
        new_value: Optional[Any] = None,
        description: Optional[str] = None,
        current_user: Optional[User] = None
) -> Optional[AuditLog]:
    """
    Convenience function to log audit events with current user context.
    """
    user_id = current_user.id if current_user else None

    return log_audit_event(
        db=db,
        action_type=action_type,
        entity_type=entity_type,
        entity_id=entity_id,
        field_name=field_name,
        old_value=old_value,
        new_value=new_value,
        description=description,
        user_id=user_id,
        request=request
    )