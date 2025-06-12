import pytest
from sqlalchemy.orm import Session

from app.crud.user import user_crud
from app.schemas.user import UserCreate, UserUpdate
from app.models.user import User

import uuid

def test_create_user(db: Session):
    # Use a unique email and username for each test run
    unique_id = str(uuid.uuid4())
    user_in = UserCreate(
        email=f"test_create_{unique_id}@example.com",
        username=f"test_create_user_{unique_id}",
        password="password",
        full_name="Test Create User"
    )
    user = user_crud.create_user(db, user=user_in)
    assert user.email == user_in.email
    assert user.username == user_in.username
    assert hasattr(user, "hashed_password")
    assert user.full_name == user_in.full_name

def test_get_user(db: Session, user: User): # 'user' fixture provides a unique user
    stored_user = user_crud.get_user(db, user_id=user.id)
    assert stored_user
    assert stored_user.email == user.email
    assert stored_user.username == user.username
    assert stored_user.hashed_password == user.hashed_password

def test_update_user(db: Session, user: User): # 'user' fixture provides a unique user
    user_update = UserUpdate(full_name="Updated Name")
    updated_user = user_crud.update_user(db, user_id=user.id, user_update=user_update)
    assert updated_user.full_name == "Updated Name"
    assert updated_user.email == user.email
    assert updated_user.username == user.username


# def test_delete_user(db: Session, user: User): # 'user' fixture provides a unique user
#     # Assuming you have `remove_user` now in user_crud.py
#     # If not, add this to app/crud/user.py:
#     # def remove_user(self, db: Session, user_id: int) -> Optional[User]:
#     #     db_user = db.query(User).filter(User.id == user_id).first()
#     #     if db_user:
#     #         db.delete(db_user)
#     #         db.commit() # Don't commit here for tests using a rollback strategy
#     #     return db_user
#     #
#     # Instead of committing in CRUD, we'll rollback the session in conftest.
#     # So, UserCRUD.remove_user should just delete and not commit if you want rollback.
#     # If you keep commit in remove_user, that's fine, but the session needs
#     # to be cleared.
#
#     # Option 1: If remove_user exists and commits:
#     user_crud.remove_user(db, user_id=user.id)
#     deleted_user = user_crud.get_user(db, user_id=user.id)
#     assert deleted_user is None
#
#     # Option 2: If remove_user *doesn't* commit, rely on session rollback
#     # db.delete(user) # Directly delete the fixture user if no specific remove_user
#     # db.flush() # Flush to apply deletion
#     # deleted_user = user_crud.get_user(db, user_id=user.id)
#     # assert deleted_user is None


@pytest.fixture
def user(db: Session):
    # Use a unique email and username for the fixture as well
    unique_id = str(uuid.uuid4())
    user_in = UserCreate(
        email=f"fixture_{unique_id}@example.com",
        username=f"fixture_user_{unique_id}",
        password="password",
        full_name="Fixture User"
    )
    # This will be created once per test that needs it, and committed by the fixture setup
    created_user = user_crud.create_user(db, user=user_in)
    return created_user