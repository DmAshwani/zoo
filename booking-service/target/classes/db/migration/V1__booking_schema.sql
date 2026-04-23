-- 1. Core Bookings Table
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER, -- Reference to user in Identity Service
    slot_id INTEGER NOT NULL, -- Reference to slot in Inventory Service
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, CONFIRMED, FAILED, EXPIRED
    total_amount DECIMAL(10,2) NOT NULL,
    adult_tickets INTEGER NOT NULL,
    child_tickets INTEGER NOT NULL,
    add_on_camera INTEGER DEFAULT 0,
    add_on_safari INTEGER DEFAULT 0,
    guest_full_name VARCHAR(100),
    guest_email VARCHAR(100),
    guest_mobile_number VARCHAR(20),
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    pdf_url TEXT,
    expiry_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Booking Add-ons (Mapping Table)
CREATE TABLE booking_add_ons (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id),
    add_on_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL
);

-- 3. Booking Audit Logs
CREATE TABLE booking_audit (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id),
    status VARCHAR(50),
    request_payload TEXT,
    price_breakdown TEXT,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_razorpay_order ON bookings(razorpay_order_id);
