from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_rules_endpoint_reports_template_state():
    response = client.get("/rules")
    assert response.status_code == 200
    body = response.json()
    assert "standard" in body
    assert "is_template" in body
    assert "rule_count" in body


def test_recommend_with_sample_input(sample_floor_plan):
    response = client.post("/recommend", json=sample_floor_plan)
    assert response.status_code == 200
    body = response.json()
    assert body["client_id"] == sample_floor_plan["client_id"]
    assert "compliance_score" in body
    assert "review_flags" in body
    assert "equipment_recommendations" in body


def test_recommend_rejects_malformed_payload():
    response = client.post("/recommend", json={"client_id": "missing-fields-only"})
    assert response.status_code == 422  # Pydantic validation error, not a 500
