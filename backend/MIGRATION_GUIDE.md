# Database Migration Guide with Alembic in Docker

This guide explains how to manage database migrations using Alembic in a Dockerized environment, specifically for your `react-fastapi` backend.

## Prerequisites
- Docker and Docker Compose installed
- Python 3.8+ (for development, though Alembic runs inside Docker)
- PostgreSQL (or your database of choice)

## Project Structure
Key files for migrations:
- `alembic.ini` - Main Alembic configuration (should be committed to Git)
- `alembic/env.py` - Migration environment setup (essential for Alembic's operation)
- `alembic/versions/` - Contains generated migration scripts (should be committed to Git)
- `backend/app/models/` - Contains SQLAlchemy models (your database schema definitions)
- `backend/app/core/database.py` - Database connection setup for your application

## Setup Instructions

1.  **Build and Start Containers**:
    Ensure all your services, especially your `backend` and `db` (PostgreSQL) are built and running or ready to be run by Docker Compose.
    ```bash
    docker-compose up -d --build
    ```
    *Note: For one-off commands like migrations, `docker-compose run` will automatically start dependent services like `postgres` if they aren't already running. You typically don't need `make up` or `docker-compose up -d` before running a migration command, but it's good practice to ensure everything is ready.*

## Migration Commands (Using `docker-compose run`)

All Alembic commands must be executed **inside the `backend` Docker container**. We use `docker-compose run --rm backend` to execute a one-off command in a fresh instance of the backend service container, automatically removing it afterwards.

### 1. Create a new migration script
This command compares your current database schema (if connected) with your SQLAlchemy models and generates a new Python file representing the changes.
```bash
docker-compose run --rm backend alembic revision --autogenerate -m "your_migration_message"
```
*   Replace `"your_migration_message"` with a descriptive message (e.g., "add_contacts_table").
*   **Action Required:** After running, carefully **review the generated `.py` file** in `alembic/versions/`. Ensure it accurately reflects the schema changes you intend. Manual adjustments might be necessary for complex changes.

### 2. Apply pending migrations to the database
This executes all migration scripts that have not yet been applied, bringing your database to the latest schema version.
```bash
docker-compose run --rm backend alembic upgrade head
```

### 3. Rollback the last migration
This command reverts the most recently applied migration. Use with caution in production!
```bash
docker-compose run --rm backend alembic downgrade -1
```

### 4. View the current database revision
Shows which migration revision is currently applied to your database.
```bash
docker-compose run --rm backend alembic current
```

### 5. View migration history
Displays a list of all migration scripts and their status (applied/not applied).
```bash
docker-compose run --rm backend alembic history
```

## Best Practices

1.  **Always review generated migrations**:
    *   `--autogenerate` is a powerful tool, but it's not perfect. Always open the generated `.py` file in `alembic/versions/` and manually verify its `upgrade()` and `downgrade()` functions.
    *   Manual adjustments are often needed for things like data migrations, renaming columns, or handling complex default values.

2.  **Test migrations locally first**:
    *   Before merging to a shared branch or deploying, test your migrations on a development database to ensure they work as expected.
    *   Consider using a separate database for migration testing in CI/CD pipelines.

3.  **Environment variables for database connection**:
    Ensure your database credentials and connection string are managed securely via environment variables (e.g., in a `.env` file that is in `.gitignore`). Your `alembic.ini` or `alembic/env.py` should reference these variables.
    Example `.env` (should be in `.gitignore`):
    ```ini
    POSTGRES_SERVER=db
    POSTGRES_USER=postgres
    POSTGRES_PASSWORD=postgres
    POSTGRES_DB=app
    ```
    And your `alembic.ini` or `alembic/env.py` would use these, for example:
    ```ini
    # alembic.ini excerpt (if using environment variable directly)
    sqlalchemy.url = postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_SERVER}/${POSTGRES_DB}
    ```
    Or as handled by `env.py` which is more common.

4.  **Docker-specific considerations**:
    *   **Network Connectivity:** Ensure your `backend` service can reach your `db` service over the Docker network (e.g., `db` as the hostname for PostgreSQL).
    *   **Volume Mounts:** For persistent database data, ensure you have volume mounts configured for your `db` service in `docker-compose.yaml`.
    *   **Container Startup Order/Readiness:** `docker-compose run` typically handles starting dependencies, but for applications, ensure your database is fully ready before your backend attempts to connect (using health checks or wait-for scripts in production setups can help).

## Troubleshooting

**Database not ready / Connection issues**:
*   Verify your `POSTGRES_SERVER`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` environment variables (in your `.env` file).
*   Ensure the `db` service is defined correctly in `docker-compose.yaml` and is accessible from the `backend` service.
*   Check your `alembic.ini` (and `alembic/env.py`) for the correct database connection string, matching your `docker-compose.yaml` service names (e.g., `postgresql://postgres:postgres@db/app`).
*   Try `docker-compose logs db` to see if your database started without errors.

**Migration conflicts**:
If you encounter conflicts when merging branches with migrations, you may need to:
1.  Manually edit the conflicting migration files to resolve the differences.
2.  Create a new "merge migration" using `alembic revision --merge` (advanced).
3.  Manually `stamp` the database to a specific revision if you are confident about a particular state (`alembic stamp <revision_id>`).

## Example Workflow for a New Schema Change

1.  **Modify Your SQLAlchemy Models**:
    Edit your Python model files (e.g., `backend/app/models.py`) to add the new table, column, or any other schema change.

2.  **Generate a Migration Script**:
    ```bash
    docker-compose run --rm backend alembic revision --autogenerate -m "add_new_table_or_column_name"
    ```
    *   **Crucial:** Open the generated `.py` file in `alembic/versions/` and carefully review the `upgrade()` and `downgrade()` functions. Make any necessary manual corrections.

3.  **Apply the Migration**:
    ```bash
    docker-compose run --rm backend alembic upgrade head
    ```
    *   This applies the new script (and any other pending ones) to your database.

4.  **Verify the Changes (Optional but Recommended)**:
    *   You can connect to your database directly (e.g., using `pgcli`, `psql`, or a GUI tool like DBeaver) to verify the new table/column exists.
    *   You can also run `docker-compose run --rm backend alembic current` to see the new head revision.

5.  **Commit Changes to Git**:
    Commit your modified SQLAlchemy models, the newly generated migration script (`alembic/versions/*.py`), and any relevant `alembic.ini` or other configuration changes.