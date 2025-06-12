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