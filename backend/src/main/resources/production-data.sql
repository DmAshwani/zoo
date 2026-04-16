-- Zoo Booking System - Production Database Initialization
-- Run this after Hibernate creates the schema

-- Initialize Ticket Types
INSERT INTO ticket_types (name, default_price, is_active) VALUES
('ADULT', 100.0, true) ON CONFLICT DO NOTHING;

INSERT INTO ticket_types (name, default_price, is_active) VALUES
('CHILD', 50.0, true) ON CONFLICT DO NOTHING;

-- Initialize Add-On Services
INSERT INTO add_on_master (name, type, price, max_limit_per_booking, available_capacity, booked_capacity, is_active) VALUES
('Camera', 'PER_PERSON', 100.0, 2, NULL, 0, true) ON CONFLICT DO NOTHING;

INSERT INTO add_on_master (name, type, price, max_limit_per_booking, available_capacity, booked_capacity, is_active) VALUES
('Safari', 'PER_PERSON', 150.0, 1, 50, 0, true) ON CONFLICT DO NOTHING;

INSERT INTO add_on_master (name, type, price, max_limit_per_booking, available_capacity, booked_capacity, is_active) VALUES
('VIP Meal', 'PER_BOOKING', 500.0, 1, 100, 0, true) ON CONFLICT DO NOTHING;

-- Note: Slot Pricing must be added after slots are created
-- Example slot pricing (uncomment and adjust after creating slots):
-- INSERT INTO slot_pricing (slot_id, ticket_type, price, is_active) VALUES
-- (1, 'ADULT', 150.0, true);
-- INSERT INTO slot_pricing (slot_id, ticket_type, price, is_active) VALUES
-- (1, 'CHILD', 80.0, true);

