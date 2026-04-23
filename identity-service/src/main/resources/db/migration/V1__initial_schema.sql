-- 1. Roles Master
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Permissions Master
CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Menu Items List
CREATE TABLE menu_items (
    id SERIAL PRIMARY KEY,
    label VARCHAR(100) NOT NULL,
    path VARCHAR(255),
    icon VARCHAR(100),
    parent_id INTEGER REFERENCES menu_items(id),
    sequence INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    is_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Junction Tables

-- User <-> Roles
CREATE TABLE user_roles (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- Role <-> Permissions
CREATE TABLE role_permissions (
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- Permission <-> Menus
CREATE TABLE permission_menus (
    permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
    menu_item_id INTEGER REFERENCES menu_items(id) ON DELETE CASCADE,
    PRIMARY KEY (permission_id, menu_item_id)
);

-- Initial Data Seed
INSERT INTO roles (name, code, description) VALUES 
('ROLE_ADMIN', 'ADM', 'System Administrator with full access'),
('ROLE_STAFF', 'STF', 'Zoo Staff with operational access'),
('ROLE_USER', 'USR', 'Regular Visitor/User');

INSERT INTO permissions (name, code, description) VALUES 
('View Dashboard', 'VIEW_DASHBOARD', 'Permission to see the admin dashboard'),
('Manage Users', 'MANAGE_USERS', 'Full CRUD on users'),
('Manage Pricing', 'MANAGE_PRICING', 'Change ticket prices'),
('Scan Tickets', 'SCAN_TICKETS', 'Access to gatekeeper portal');

INSERT INTO menu_items (label, path, icon, sequence) VALUES 
('Dashboard', '/admin/dashboard', 'dashboard', 1),
('User Management', '/admin/users', 'group', 2),
('Pricing', '/admin/pricing', 'payments', 3),
('Gatekeeper', '/staff/gatekeeper', 'door_open', 4);

-- Map Admin Role to all permissions
INSERT INTO role_permissions (role_id, permission_id) 
SELECT 1, id FROM permissions;

-- Map Permissions to Menus
INSERT INTO permission_menus (permission_id, menu_item_id) VALUES 
(1, 1), -- VIEW_DASHBOARD -> Dashboard Menu
(2, 2), -- MANAGE_USERS -> User Management Menu
(3, 3), -- MANAGE_PRICING -> Pricing Menu
(4, 4); -- SCAN_TICKETS -> Gatekeeper Menu
