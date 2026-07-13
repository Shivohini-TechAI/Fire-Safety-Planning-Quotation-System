"""
Tests for the X-API-Key protection on /recommend and /rules/reload.

Uses a fixture that temporarily sets settings.API_KEY and always resets
it afterward, so these tests never leak state into test_api.py's existing
tests (which assume auth is disabled, matching local solo-dev defaults).
"""
import pytest
from fastapi.testclient import TestClient

from app.main import app
from config.settings import settings

client = TestClient(app)


@pytest.fixture
def api_key_enabled():
    original = settings.API_KEY
    settings.API_KEY = "test-secret-key-123"
    yield settings.API_KEY
    settings.API_KEY = original  # always restore, even if the test fails


def test_recommend_open_when_no_key_configured(sample_floor_plan):
    """Matches local solo-dev default: no key set -> no header required."""
    settings.API_KEY = ""
    response = client.post("/recommend", json=sample_floor_plan)
    assert response.status_code == 200


def test_recommend_rejects_missing_header_when_key_configured(sample_floor_plan, api_key_enabled):
    response = client.post("/recommend", json=sample_floor_plan)
    assert response.status_code == 401


def test_recommend_rejects_wrong_key(sample_floor_plan, api_key_enabled):
    response = client.post(
        "/recommend", json=sample_floor_plan, headers={"X-API-Key": "wrong-value"}
    )
    assert response.status_code == 401


def test_recommend_accepts_correct_key(sample_floor_plan, api_key_enabled):
    response = client.post(
        "/recommend", json=sample_floor_plan, headers={"X-API-Key": api_key_enabled}
    )
    assert response.status_code == 200


def test_health_never_requires_a_key(api_key_enabled):
    """Health checks must stay reachable for monitoring even when auth is on."""
    response = client.get("/health")
    assert response.status_code == 200


def test_rules_get_never_requires_a_key(api_key_enabled):
    """Read-only /rules stays open so the frontend can show template status."""
    response = client.get("/rules")
    assert response.status_code == 200


def test_rules_reload_requires_key_when_configured(api_key_enabled):
    response = client.post("/rules/reload")
    assert response.status_code == 401