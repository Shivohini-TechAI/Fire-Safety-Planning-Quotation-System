from fastapi.testclient import TestClient
from api.main import app

client = TestClient(app)

def test_home():

    response = client.get("/")

    assert response.status_code == 200

def test_detect_route_exists():

    routes = [route.path for route in app.routes]

    assert "/detect" in routes
