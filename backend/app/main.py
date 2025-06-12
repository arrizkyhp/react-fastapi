from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# from app.api.v1.api import api_router
# from app.core.config import settings
from .core import settings

app = FastAPI(title=settings.PROJECT_NAME, debug=settings.DEBUG)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def read_root():
    return {"message": "FastAPI Authentication API"}