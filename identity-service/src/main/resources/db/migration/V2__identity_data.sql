-- 1. Roles
INSERT INTO roles (name) VALUES ('ROLE_ADMIN'), ('ROLE_USER'), ('ROLE_STAFF');

-- 2. Permissions
INSERT INTO permissions (name, description) VALUES 
('READ_SLOTS', 'View available slots'),
('BOOK_TICKETS', 'Book zoo tickets'),
('MANAGE_ZOO', 'Admin management');

-- 3. Menu Items
INSERT INTO menu_items (title, path, icon, parent_id, sort_order) VALUES 
('Dashboard', '/dashboard', 'LayoutDashboard', NULL, 1),
('Book Tickets', '/booking', 'Ticket', NULL, 2),
('Manage Slots', '/admin/slots', 'Calendar', NULL, 3);

-- 4. Map Permissions to Roles
-- Admin gets all
INSERT INTO role_permissions (role_id, permission_id) 
SELECT r.id, p.id FROM roles r, permissions p WHERE r.name = 'ROLE_ADMIN';

-- 5. Map Menus to Roles
-- Admin gets all menus
INSERT INTO role_menus (role_id, menu_id)
SELECT r.id, m.id FROM roles r, menu_items m WHERE r.name = 'ROLE_ADMIN';

-- 6. Default Admin (Password: admin123 - bcrypt encoded)
INSERT INTO users (email, password, full_name, role_id, is_active)
SELECT 'admin@zoo.com', '$2a$10$8.UnVuG9HHgffUDAlk8qn.6nQH9XJ5d2jN5.69P5p90X1D7L6X1XG', 'System Admin', id, true 
FROM roles WHERE name = 'ROLE_ADMIN';
