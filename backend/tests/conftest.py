import os

# Must be set before any app module is imported so pydantic-settings reads it
os.environ["DATABASE_URL"] = "sqlite:///./test.db"
os.environ.setdefault("PROJECT_NAME", "Test AutoShop")
os.environ.setdefault("ALLOWED_ORIGINS", '["http://localhost"]')

from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient
import pytest

# Clear lru_cache so Settings picks up the env vars we just set
from database import get_settings, Base, engine as app_engine

get_settings.cache_clear()

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=app_engine)


@pytest.fixture
def client():
    from database import get_db
    from main import app

    Base.metadata.create_all(bind=app_engine)

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as c:
        yield c

    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=app_engine)
