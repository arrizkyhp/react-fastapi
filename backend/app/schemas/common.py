from pydantic import BaseModel
from typing import List, Optional, TypeVar, Generic

T = TypeVar('T')

class PaginationMetadata(BaseModel):
    """Pagination metadata for paginated responses."""
    total_items: int
    total_pages: int
    current_page: int
    per_page: int
    has_next: bool
    has_prev: bool
    next_num: Optional[int] = None
    prev_num: Optional[int] = None

class PaginatedResponse(BaseModel, Generic[T]):
    """Generic paginated response wrapper."""
    items: List[T]
    pagination: Optional[PaginationMetadata] = None