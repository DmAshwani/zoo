-- 1. Ticket Types
CREATE TABLE ticket_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    default_price DECIMAL(10,2) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Slot Pricing Overrides
CREATE TABLE slot_pricing (
    id SERIAL PRIMARY KEY,
    slot_id INTEGER NOT NULL,
    ticket_type VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. System Settings (for Dynamic Pricing)
CREATE TABLE system_settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    value_type VARCHAR(20) NOT NULL, -- STRING, INT, DOUBLE, BOOLEAN
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initial Data
INSERT INTO ticket_types (name, default_price, description) VALUES 
('ADULT', 800.00, 'Standard adult ticket'),
('CHILD', 500.00, 'Child ticket (under 12)');

INSERT INTO system_settings (key, value, value_type, description) VALUES 
('dynamic_pricing_enabled', 'true', 'BOOLEAN', 'Toggle automatic surge pricing'),
('surge_threshold_percent', '90', 'INT', 'Occupancy percentage to trigger surge'),
('surge_multiplier', '1.5', 'DOUBLE', 'Multiplier for surge pricing'),
('manual_overrides_enabled', 'true', 'BOOLEAN', 'Toggle manual price overrides');
