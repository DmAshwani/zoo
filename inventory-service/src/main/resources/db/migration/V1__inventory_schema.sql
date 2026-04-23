CREATE TABLE slots (
    id SERIAL PRIMARY KEY,
    slot_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    total_capacity INTEGER NOT NULL,
    available_capacity INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_slots_date ON slots(slot_date);

-- Initial Slots Data
INSERT INTO slots (slot_date, start_time, end_time, total_capacity, available_capacity) VALUES 
(CURRENT_DATE, '09:00:00', '12:00:00', 100, 100),
(CURRENT_DATE, '12:00:00', '15:00:00', 100, 100),
(CURRENT_DATE, '15:00:00', '18:00:00', 100, 100),
(CURRENT_DATE + 1, '09:00:00', '12:00:00', 100, 100),
(CURRENT_DATE + 1, '12:00:00', '15:00:00', 100, 100),
(CURRENT_DATE + 1, '15:00:00', '18:00:00', 100, 100);
