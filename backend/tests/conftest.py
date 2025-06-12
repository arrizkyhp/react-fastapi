import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

import sys
import os

project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, project_root)

from app.core.config import settings
from app.core.database import Base, get_db
from app.main import app

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

test_engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


@pytest.fixture(scope="session")
def db_engine():
    # This runs once at the beginning of the entire test session
    Base.metadata.create_all(bind=test_engine)
    yield test_engine
    Base.metadata.drop_all(bind=test_engine)


@pytest.fixture(scope="function")
def db(db_engine):
    # This runs once for EACH TEST FUNCTION
    connection = db_engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    yield session

    session.close()
    transaction.rollback() # Rolls back changes for the current test
    connection.close()


# CHANGE THE SCOPE OF THE CLIENT FIXTURE TO "function"
@pytest.fixture(scope="function")
def client(db: Session): # 'db' here is the session provided by the 'db' fixture
    def override_get_db():
        yield db

    # Store original dependency override to restore it later
    # This is important if you have other tests (e.g., non-API tests) that
    # might need the original get_db or if fixtures in different files interfere.
    original_get_db = app.dependency_overrides.get(get_db)
    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as c:
        yield c

    # Clean up overrides after EACH TEST FUNCTION finishes
    if original_get_db:
        app.dependency_overrides[get_db] = original_get_db
    else:
        del app.dependency_overrides[get_db] # Or app.dependency_overrides.clear()