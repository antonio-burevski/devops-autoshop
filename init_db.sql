-- Auto/Moto Shop Database Schema

-- ============================================================================
-- Table: customers
-- ============================================================================
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

-- ============================================================================
-- Table: vehicles
-- ============================================================================
CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL,
    price FLOAT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'available',
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_vehicles_customer_id ON vehicles(customer_id);

-- ============================================================================
-- Table: services
-- ============================================================================
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    description VARCHAR(500) NOT NULL,
    cost FLOAT NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
);

CREATE INDEX IF NOT EXISTS idx_services_vehicle_id ON services(vehicle_id);

-- ============================================================================
-- Sample Test Data
-- ============================================================================

-- Insert sample customers
INSERT INTO customers (name, email, phone) VALUES
('John Smith', 'john.smith@email.com', '+1-555-0101'),
('Sarah Johnson', 'sarah.j@email.com', '+1-555-0102'),
('Mike Williams', 'mike.w@email.com', '+1-555-0103'),
('Emily Brown', 'emily.brown@email.com', '+1-555-0104'),
('David Martinez', 'david.m@email.com', '+1-555-0105');

-- Insert sample vehicles
INSERT INTO vehicles (make, model, year, price, status, customer_id) VALUES
('Toyota', 'Camry', 2020, 25000.00, 'sold', 1),
('Harley-Davidson', 'Street 750', 2019, 8500.00, 'sold', 1),
('Honda', 'CR-V', 2021, 32000.00, 'sold', 2),
('Ford', 'F-150', 2018, 35000.00, 'available', NULL),
('BMW', '3 Series', 2022, 45000.00, 'reserved', 4),
('Yamaha', 'YZF-R3', 2023, 5500.00, 'available', NULL);

-- Insert sample services
INSERT INTO services (vehicle_id, description, cost, date, status) VALUES
(1, 'Regular oil change with synthetic oil', 75.00, '2024-01-15', 'completed'),
(1, 'Rotated all four tires and checked alignment', 50.00, '2024-03-20', 'completed'),
(2, 'Adjusted and lubricated motorcycle chain', 45.00, '2024-02-10', 'completed'),
(3, 'Full brake system inspection and pad replacement', 320.00, '2024-04-05', 'completed'),
(4, 'Check engine light diagnostics', 125.00, '2024-05-12', 'in-progress'),
(5, 'Full service including oil, filter, and brake check', 450.00, '2024-06-01', 'pending');
