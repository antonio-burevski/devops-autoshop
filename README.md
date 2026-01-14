# Auto/Moto Shop API

FastAPI backend for managing an auto/moto shop with vehicles, customers, and services.

## Features

- Complete CRUD operations for Customers, Vehicles, and Services
- PostgreSQL database with SQLAlchemy ORM
- Pydantic validation for all requests/responses
- CORS enabled for React frontend (localhost:3000)
- Automatic OpenAPI documentation at `/api/docs`

## Setup

### 1. Create a virtual environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure environment variables

Copy `.env.example` to `.env` and update with your PostgreSQL credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/autoshop
PROJECT_NAME=Auto/Moto Shop API
ALLOWED_ORIGINS=["http://localhost:3000"]
```

### 4. Create the database

```bash
# Connect to PostgreSQL and create the database
psql -U postgres
CREATE DATABASE autoshop;
\q
```

### 5. Run the application

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- API: http://localhost:8000
- Interactive docs: http://localhost:8000/api/docs
- Alternative docs: http://localhost:8000/api/redoc

## API Endpoints

### Customers
- `POST /api/customers` - Create a new customer
- `GET /api/customers` - List all customers (supports pagination)
- `GET /api/customers/{id}` - Get a specific customer
- `PUT /api/customers/{id}` - Update a customer
- `DELETE /api/customers/{id}` - Delete a customer

### Vehicles
- `POST /api/vehicles` - Create a new vehicle
- `GET /api/vehicles` - List all vehicles (supports pagination)
- `GET /api/vehicles/{id}` - Get a specific vehicle
- `PUT /api/vehicles/{id}` - Update a vehicle
- `DELETE /api/vehicles/{id}` - Delete a vehicle

### Services
- `POST /api/services` - Create a new service record
- `GET /api/services` - List all services (supports pagination)
- `GET /api/services/{id}` - Get a specific service
- `PUT /api/services/{id}` - Update a service
- `DELETE /api/services/{id}` - Delete a service

### Health Check
- `GET /health` - Check API health status

## Database Schema

### customers
- id (Primary Key)
- name
- email (Unique)
- phone

### vehicles
- id (Primary Key)
- make
- model
- year
- price
- status
- customer_id (Foreign Key to customers)

### services
- id (Primary Key)
- vehicle_id (Foreign Key to vehicles)
- description
- cost
- date
- status

## Example Requests

### Create a Customer
```bash
curl -X POST "http://localhost:8000/api/customers" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "555-1234"
  }'
```

### Create a Vehicle
```bash
curl -X POST "http://localhost:8000/api/vehicles" \
  -H "Content-Type: application/json" \
  -d '{
    "make": "Toyota",
    "model": "Camry",
    "year": 2022,
    "price": 25000,
    "status": "available",
    "customer_id": 1
  }'
```

### Create a Service
```bash
curl -X POST "http://localhost:8000/api/services" \
  -H "Content-Type: application/json" \
  -d '{
    "vehicle_id": 1,
    "description": "Oil change and tire rotation",
    "cost": 75.50,
    "date": "2024-01-15",
    "status": "completed"
  }'
```

## Development

The application automatically creates database tables on startup. For production, consider using Alembic for database migrations.

### Running tests

```bash
pip install pytest pytest-asyncio httpx
pytest
```
