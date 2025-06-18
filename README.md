# React-FastAPI Project

## Technology Stack

- **Frontend**: React with Vite
- **Backend**: FastAPI
- **Database**: PostgreSQL

This is a full-stack project combining a modern React frontend with a FastAPI backend.

## Development Setup

### Backend (Docker)
1. Start the backend services:
```bash
docker-compose -f compose.dev.yaml up postgres backend
```

### Frontend (Local)
1. Install dependencies:
```bash
pnpm install
```

2. Start the development server:
```bash
pnpm run dev
```

The frontend will be available at `http://localhost:5173`

### Accessing Documentation

- Backend API docs (Swagger UI): `http://localhost:8000/docs`
