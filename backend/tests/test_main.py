def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_list_customers_empty(client):
    response = client.get("/api/customers")
    assert response.status_code == 200
    assert response.json() == []


def test_create_customer(client):
    payload = {"name": "Jane Doe", "email": "jane@example.com", "phone": "071-123-456"}
    response = client.post("/api/customers", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Jane Doe"
    assert data["email"] == "jane@example.com"
    assert "id" in data


def test_create_duplicate_customer(client):
    payload = {"name": "Jane Doe", "email": "jane@example.com", "phone": "071-123-456"}
    client.post("/api/customers", json=payload)
    response = client.post("/api/customers", json=payload)
    assert response.status_code == 400
    assert "Email already registered" in response.json()["detail"]


def test_get_customer_not_found(client):
    response = client.get("/api/customers/999")
    assert response.status_code == 404


def test_list_vehicles_empty(client):
    response = client.get("/api/vehicles")
    assert response.status_code == 200
    assert response.json() == []


def test_create_vehicle(client):
    customer = client.post(
        "/api/customers",
        json={"name": "John Smith", "email": "john@example.com", "phone": "072-000-001"},
    ).json()

    payload = {
        "make": "Toyota",
        "model": "Corolla",
        "year": 2020,
        "price": 15000.00,
        "status": "available",
        "customer_id": customer["id"],
    }
    response = client.post("/api/vehicles", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["make"] == "Toyota"
    assert data["model"] == "Corolla"
    assert data["customer_id"] == customer["id"]


def test_list_services_empty(client):
    response = client.get("/api/services")
    assert response.status_code == 200
    assert response.json() == []


def test_delete_customer(client):
    customer = client.post(
        "/api/customers",
        json={"name": "To Delete", "email": "delete@example.com", "phone": "070-000-000"},
    ).json()

    response = client.delete(f"/api/customers/{customer['id']}")
    assert response.status_code == 204

    response = client.get(f"/api/customers/{customer['id']}")
    assert response.status_code == 404
