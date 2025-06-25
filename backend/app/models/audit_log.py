from sqlalchemy import Column, String, Integer, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime, timezone
from .base import BaseModel
import json


class AuditLog(BaseModel):
    __tablename__ = "audit_logs"

    user_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    action_type = Column(String(50), nullable=False)  # e.g., 'CREATE', 'UPDATE', 'DELETE'
    entity_type = Column(String(100), nullable=False)  # e.g., 'Category', 'Permission', 'Role'
    entity_id = Column(Integer, nullable=True)  # ID of the record being audited
    field_name = Column(String(100), nullable=True)  # The specific field changed (for UPDATEs)
    old_value = Column(Text, nullable=True)  # Stored as JSON string
    new_value = Column(Text, nullable=True)  # Stored as JSON string
    description = Column(Text, nullable=True)  # Human-readable description
    ip_address = Column(String(45), nullable=True)  # IPv4 or IPv6
    user_agent = Column(Text, nullable=True)

    # Override the created_at from BaseModel to use timestamp for consistency
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationship to User model for easier access to user details
    user = relationship('User', back_populates='audit_logs')

    def __repr__(self):
        return (
            f"<AuditLog {self.action_type} {self.entity_type}:{self.entity_id} "
            f"by User:{self.user_id} at {self.timestamp}>"
        )

    def to_dict(self):
        """Converts the AuditLog object to a dictionary for JSON serialization."""
        utc_aware_timestamp = self.timestamp
        if utc_aware_timestamp.tzinfo is None:
            # If naive, assume it's UTC because that's what we store
            utc_aware_timestamp = utc_aware_timestamp.replace(tzinfo=timezone.utc)
        else:
            # If already timezone-aware, convert to UTC explicitly
            utc_aware_timestamp = utc_aware_timestamp.astimezone(timezone.utc)

        # Format to ISO 8601 string, with milliseconds and 'Z' for UTC
        timestamp_iso_utc = utc_aware_timestamp.isoformat(timespec='milliseconds').replace('+00:00', 'Z')

        data = {
            "id": self.id,
            "user_id": self.user_id,
            "timestamp": timestamp_iso_utc,
            "action_type": self.action_type,
            "entity_type": self.entity_type,
            "entity_id": self.entity_id,
            "field_name": self.field_name,
            "old_value": json.loads(self.old_value) if self.old_value else None,
            "new_value": json.loads(self.new_value) if self.new_value else None,
            "description": self.description,
            "ip_address": self.ip_address,
            "user_agent": self.user_agent,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

        if self.user:
            data['user_details'] = {
                'id': self.user.id,
                'username': getattr(self.user, 'username', None) or getattr(self.user, 'email', 'Unknown')
            }

        return data