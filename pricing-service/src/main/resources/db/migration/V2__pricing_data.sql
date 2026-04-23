-- 1. Ticket Types
INSERT INTO ticket_types (name, base_price, description) VALUES 
('Adult', 500.00, 'Standard entry for adults (12+ years)'),
('Child', 250.00, 'Entry for children (3-12 years)');

-- 2. System Settings
INSERT INTO system_settings (key, value, description) VALUES 
('surge_threshold_percentage', '70', 'Occupancy percentage above which surge pricing applies'),
('surge_multiplier', '1.2', 'Price multiplier during surge');
