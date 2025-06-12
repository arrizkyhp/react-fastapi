## Create and Apply Initial Migration Inside Docker
 
## Create initial migration
docker-compose run --rm backend alembic revision --autogenerate -m "Initial migration"

## Apply the migration
docker-compose run --rm backend alembic upgrade head