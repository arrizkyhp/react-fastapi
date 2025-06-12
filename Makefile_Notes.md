# Makefile Reference for `react-fastapi` Project (Backend)

This document provides a complete `Makefile` for managing the **backend part** of your `react-fastapi` project, particularly for Docker Compose services and Alembic database migrations.

## 1. Makefile Content

Create a file named `Makefile` (no extension) in the root of your `react-fastapi` directory (at the same level as `backend/` and `compose.yaml`).

```makefile
# Makefile (in project root, same level as compose.yaml)
.PHONY: migrate migrate-create migrate-up migrate-down migrate-current backend-shell

# Database migrations
migrate:
	docker-compose run --rm backend alembic upgrade head

migrate-create:
	docker-compose run --rm backend alembic revision --autogenerate -m "$(msg)"

migrate-up:
	docker-compose run --rm backend alembic upgrade head

migrate-down:
	docker-compose run --rm backend alembic downgrade -1

migrate-current:
	docker-compose run --rm backend alembic current

migrate-history:
	docker-compose run --rm backend alembic history

# Development helpers
backend-shell:
	docker-compose run --rm backend bash

backend-logs:
	docker-compose logs -f backend

db-logs:
	docker-compose logs -f postgres

# Start services
up:
	docker-compose up -d

down:
	docker-compose down

restart:
	docker-compose restart backend
```

**Important Note on Indentation:**
Ensure that all lines indented under a target (e.g., `docker-compose run --rm backend alembic upgrade head` under `migrate:`) are indented using a **single tab character**, not spaces. `Makefile`s are strict about this.

## 2. How to Use the Makefile

Navigate to your project's root directory in your terminal (where the `Makefile` is located) and use the `make` command followed by the desired target.

### A. Basic Commands

*   **Start all services in detached mode (`-d`):**
    ```bash
    make up
    ```

*   **Stop and remove all services:**
    ```bash
    make down
    ```

*   **Restart the `backend` service:**
    ```bash
    make restart
    ```

### B. Database Migration (Alembic) Commands

These commands interact with your `backend` Docker service to manage database schema changes using Alembic.

*   **Apply all pending migrations to the latest version:**
    ```bash
    make migrate
    # or
    make migrate-up
    ```

*   **Generate a new auto-detected migration script:**
    You **must** provide a message using `msg="Your message here"`.
    ```bash
    make migrate-create msg="Add initial user model"
    ```

*   **Revert the last applied migration:**
    ```bash
    make migrate-down
    ```

*   **Show the current database migration version:**
    ```bash
    make migrate-current
    ```

*   **Show the history of all migrations:**
    ```bash
    make migrate-history
    ```

### C. Development Helper Commands

These commands provide convenience for development and debugging.

*   **Open a bash shell inside the `backend` Docker container:**
    Useful for running tests, installing packages, or debugging directly within the container.
    ```bash
    make backend-shell
    ```

*   **Stream logs from the `backend` service:**
    ```bash
    make backend-logs
    ```

*   **Stream logs from the `postgres` (database) service:**
    ```bash
    make db-logs
    ```