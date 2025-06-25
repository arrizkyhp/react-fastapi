from fastapi import APIRouter
from .auth import router as auth_router
from .users import router as users_router
from .audit_log import router as audit_log_router

api_router = APIRouter()
api_router.include_router(auth_router, prefix="/auth", tags=["authentication"])
api_router.include_router(users_router, prefix="/users", tags=["users"])
api_router.include_router(audit_log_router, prefix="/audit", tags=["audit"])
