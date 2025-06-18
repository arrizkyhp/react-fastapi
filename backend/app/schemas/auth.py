from datetime import datetime
from pydantic import BaseModel
from typing import Optional

class ErrorResponse(BaseModel):
    status_code: int
    error_type: str
    detail: str
    timestamp: str = datetime.now().isoformat()

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenPayload(BaseModel):
    sub: Optional[str] = None

class LoginRequest(BaseModel):
    username: str
    password: str

class RefreshTokenRequest(BaseModel):
    refresh_token: str
