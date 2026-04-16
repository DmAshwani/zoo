-- Initialize default roles
INSERT INTO roles (name) VALUES ('ROLE_USER') ON CONFLICT DO NOTHING;
INSERT INTO roles (name) VALUES ('ROLE_ADMIN') ON CONFLICT DO NOTHING;

-- Insert default admin user (password: admin123)
INSERT INTO users (full_name, email, password, mobile_number) VALUES ('Admin User', 'admin@zoo.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '1234567890') ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE email = 'admin@zoo.com'), (SELECT id FROM roles WHERE name = 'ROLE_ADMIN')) ON CONFLICT DO NOTHING;
