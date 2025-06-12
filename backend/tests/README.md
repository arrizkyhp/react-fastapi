# Backend Testing Guide

This document explains how to run and write tests for the backend.

## Running Tests

Run all tests:
```bash
pytest
```

Run tests in Docker container:
```bash
docker-compose run --rm backend pytest -v
```

Run specific test file:
```bash
pytest tests/api/test_users.py
```

Run with coverage report:
```bash
pytest --cov=app tests/
```

## Test Structure

- `tests/` - Root test directory
  - `api/` - API endpoint tests
  - `crud/` - Database operation tests
  - `conftest.py` - Test fixtures and configurations

## Writing Tests

1. For API tests:
   - Use `TestClient` from FastAPI
   - Test all status codes and response schemas
   - Example: `tests/api/test_users.py`

2. For CRUD tests:
   - Test database operations directly
   - Use fixtures from `conftest.py`
   - Example: `tests/crud/test_user.py`

## Dependencies

Test dependencies are listed in `requirements.in` and `requirements.txt`.

## Configuration

- `pytest.ini` contains pytest configurations
- `.coverage` tracks test coverage
- `.env.example` has environment variables needed for testing
