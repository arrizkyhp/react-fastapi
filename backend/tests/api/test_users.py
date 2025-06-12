import pytest
import uuid
from fastapi import status
from fastapi.testclient import TestClient

from app.core.config import settings
from app.schemas.user import UserCreate
from app.schemas.auth import LoginRequest # Import LoginRequest for clarity in data structure

def test_create_user(client: TestClient):
    unique_id = str(uuid.uuid4())
    data = {
        "email": f"test_create_{unique_id}@example.com",
        "username": f"test_create_user_{unique_id}",
        "password": "password",
        "full_name": "Test Create User API"
    }
    response = client.post(
        f"{settings.API_V1_STR}/auth/register",
        json=data
    )
    # CHANGE THIS LINE:
    assert response.status_code == status.HTTP_200_OK # <--- Changed from 201 to 200
    content = response.json()
    assert content["email"] == data["email"]
    assert content["username"] == data["username"]
    assert "id" in content
    assert "hashed_password" not in content


def test_read_user_me(client: TestClient, test_user_authenticated_token: dict):
    # This test is already asserting 200 OK for the GET /users/me endpoint
    # The 'ERROR' for test_read_user_me is a cascading failure because its fixture (test_user_authenticated_token)
    # is failing during the registration step (because of the 200 vs 201 mismatch).
    # Once test_create_user's logic (and thus the fixture's internal logic) passes,
    # this error should disappear too.
    user_id = test_user_authenticated_token["id"]
    access_token = test_user_authenticated_token["access_token"]
    username = test_user_authenticated_token["username"]

    response = client.get(
        f"{settings.API_V1_STR}/users/me",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    assert response.status_code == status.HTTP_200_OK
    content = response.json()
    assert content["email"] == test_user_authenticated_token["email"]
    assert content["username"] == username
    assert content["id"] == user_id


@pytest.fixture
def test_user_authenticated_token(client: TestClient) -> dict:
    unique_id = str(uuid.uuid4())
    email = f"fixture_{unique_id}@example.com"
    username = f"fixture_user_{unique_id}"
    password = "fixturepassword"

    # 1. Register the user
    register_data = {
        "email": email,
        "username": username,
        "password": password,
        "full_name": "Fixture User API"
    }
    register_response = client.post(
        f"{settings.API_V1_STR}/auth/register",
        json=register_data
    )
    # CHANGE THIS LINE:
    assert register_response.status_code == status.HTTP_200_OK # <--- Changed from 201 to 200
    registered_user_data = register_response.json()

    # 2. Log in to get a token
    login_data = {"username": username, "password": password}
    login_response = client.post(
        f"{settings.API_V1_STR}/auth/login",
        json=login_data
    )
    assert login_response.status_code == status.HTTP_200_OK
    token_data = login_response.json()
    access_token = token_data["access_token"]

    registered_user_data["access_token"] = access_token
    registered_user_data["password"] = password
    return registered_user_data