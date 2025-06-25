from pydantic import BaseModel, Field
from typing import Optional, Any, Dict, List
from datetime import datetime


class UserDetails(BaseModel):
    id: int
    username: str


class AuditLogBase(BaseModel):
    user_id: Optional[int] = None
    action_type: str = Field(..., max_length=50)
    entity_type: str = Field(..., max_length=100)
    entity_id: Optional[int] = None
    field_name: Optional[str] = Field(None, max_length=100)
    old_value: Optional[Any] = None
    new_value: Optional[Any] = None
    description: Optional[str] = None
    ip_address: Optional[str] = Field(None, max_length=45)
    user_agent: Optional[str] = None


class AuditLogCreate(AuditLogBase):
    pass


class AuditLogResponse(AuditLogBase):
    id: int
    timestamp: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    user_details: Optional[UserDetails] = None

    class Config:
        from_attributes = True


class AuditLogFilters(BaseModel):
    entity_type: Optional[str] = None
    entity_id: Optional[int] = None
    action_type: Optional[str] = None
    user_id: Optional[int] = None
    search: Optional[str] = None
    from_date: Optional[str] = None
    to_date: Optional[str] = None
    sort_by: Optional[str] = Field(default="timestamp", pattern="^(timestamp|date|user|action|entity)$")
    sort_order: Optional[str] = Field(default="desc", pattern="^(asc|desc)$")


# class PaginationMetadata(BaseModel):
#     total_items: int
#     total_pages: int
#     current_page: int
#     per_page: int
#     has_next: bool
#     has_prev: bool
#     next_num: Optional[int] = None
#     prev_num: Optional[int] = None
#
#
# class AuditLogListResponse(BaseModel):
#     items: List[AuditLogResponse]
#     pagination: PaginationMetadata
