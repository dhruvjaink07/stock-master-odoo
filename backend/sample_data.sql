-- USERS
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- WAREHOUSES
CREATE TABLE IF NOT EXISTS warehouses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- PRODUCTS
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category_id INTEGER REFERENCES categories(id),
    unit_of_measure VARCHAR(50) NOT NULL,
    reorder_threshold INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- PRODUCT STOCK
CREATE TABLE IF NOT EXISTS product_stock (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    warehouse_id INTEGER REFERENCES warehouses(id),
    quantity INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(product_id, warehouse_id)
);

-- STOCK LEDGER (MOVE HISTORY)
CREATE TABLE IF NOT EXISTS stock_ledger (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    warehouse_id INTEGER REFERENCES warehouses(id),
    user_id INTEGER REFERENCES users(id),
    movement_type VARCHAR(20) NOT NULL, -- Receipt, Delivery, Transfer, Adjustment
    reference_id INTEGER,
    reference_type VARCHAR(20),
    quantity_change INTEGER NOT NULL,
    new_balance INTEGER NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- RECEIPTS
CREATE TABLE IF NOT EXISTS receipts (
    id SERIAL PRIMARY KEY,
    supplier_name VARCHAR(255) NOT NULL,
    warehouse_id INTEGER REFERENCES warehouses(id),
    user_id INTEGER REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS receipt_items (
    id SERIAL PRIMARY KEY,
    receipt_id INTEGER REFERENCES receipts(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    expiry_date DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- DELIVERIES
CREATE TABLE IF NOT EXISTS deliveries (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    warehouse_id INTEGER REFERENCES warehouses(id),
    user_id INTEGER REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS delivery_items (
    id SERIAL PRIMARY KEY,
    delivery_id INTEGER REFERENCES deliveries(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- TRANSFERS
CREATE TABLE IF NOT EXISTS transfers (
    id SERIAL PRIMARY KEY,
    from_warehouse_id INTEGER REFERENCES warehouses(id),
    to_warehouse_id INTEGER REFERENCES warehouses(id),
    user_id INTEGER REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transfer_items (
    id SERIAL PRIMARY KEY,
    transfer_id INTEGER REFERENCES transfers(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ADJUSTMENTS
CREATE TABLE IF NOT EXISTS adjustments (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    warehouse_id INTEGER REFERENCES warehouses(id),
    user_id INTEGER REFERENCES users(id),
    reason VARCHAR(50) NOT NULL, -- Damage, Expiry, Theft, Correction
    quantity_change INTEGER NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
-- 1. Wipe existing data and reset IDs
TRUNCATE TABLE
    receipt_items,
    receipts,
    delivery_items,
    deliveries,
    transfer_items,
    transfers,
    adjustments,
    stock_ledger,
    product_stock,
    products,
    categories,
    warehouses,
    users
RESTART IDENTITY CASCADE;

-- 2. Categories
INSERT INTO categories (name) VALUES
  ('Beverages'),
  ('Snacks'),
  ('Dairy'),
  ('Produce'),
  ('Bakery');

-- 3. Warehouses
INSERT INTO warehouses (name, location) VALUES
  ('Central Warehouse', 'Downtown'),
  ('North Warehouse', 'Uptown'),
  ('East Warehouse', 'Eastside'),
  ('South Warehouse', 'Southside'),
  ('West Warehouse', 'Westside');

-- 4. Products
INSERT INTO products (sku, name, category_id, unit_of_measure, reorder_threshold) VALUES
  ('SKU001', 'Cola', (SELECT id FROM categories WHERE name='Beverages'), 'bottle', 10),
  ('SKU002', 'Chips', (SELECT id FROM categories WHERE name='Snacks'), 'bag', 20),
  ('SKU003', 'Milk', (SELECT id FROM categories WHERE name='Dairy'), 'liter', 15),
  ('SKU004', 'Apple', (SELECT id FROM categories WHERE name='Produce'), 'kg', 30),
  ('SKU005', 'Bread', (SELECT id FROM categories WHERE name='Bakery'), 'loaf', 12);

-- 5. Users
INSERT INTO users (name, email, password_hash, is_admin) VALUES
  ('Alice', 'alice@example.com', '$2b$12$abcdefghijklmnopqrstuv', true),
  ('Bob', 'bob@example.com', '$2b$12$abcdefghijklmnopqrstuv', false),
  ('Carol', 'carol@example.com', '$2b$12$abcdefghijklmnopqrstuv', false),
  ('Dave', 'dave@example.com', '$2b$12$abcdefghijklmnopqrstuv', false),
  ('Eve', 'eve@example.com', '$2b$12$abcdefghijklmnopqrstuv', false);

-- 6. Product Stock
INSERT INTO product_stock (product_id, warehouse_id, quantity) VALUES
  ((SELECT id FROM products WHERE sku='SKU001'), (SELECT id FROM warehouses WHERE name='Central Warehouse'), 100),
  ((SELECT id FROM products WHERE sku='SKU002'), (SELECT id FROM warehouses WHERE name='North Warehouse'), 200),
  ((SELECT id FROM products WHERE sku='SKU003'), (SELECT id FROM warehouses WHERE name='East Warehouse'), 150),
  ((SELECT id FROM products WHERE sku='SKU004'), (SELECT id FROM warehouses WHERE name='South Warehouse'), 80),
  ((SELECT id FROM products WHERE sku='SKU005'), (SELECT id FROM warehouses WHERE name='West Warehouse'), 60);

-- 7. Receipts
INSERT INTO receipts (supplier_name, warehouse_id, user_id, status) VALUES
  ('Supplier A', (SELECT id FROM warehouses WHERE name='Central Warehouse'), (SELECT id FROM users WHERE name='Alice'), 'completed'),
  ('Supplier B', (SELECT id FROM warehouses WHERE name='North Warehouse'), (SELECT id FROM users WHERE name='Bob'), 'completed'),
  ('Supplier C', (SELECT id FROM warehouses WHERE name='East Warehouse'), (SELECT id FROM users WHERE name='Carol'), 'completed'),
  ('Supplier D', (SELECT id FROM warehouses WHERE name='South Warehouse'), (SELECT id FROM users WHERE name='Dave'), 'completed'),
  ('Supplier E', (SELECT id FROM warehouses WHERE name='West Warehouse'), (SELECT id FROM users WHERE name='Eve'), 'completed');

-- 8. Receipt Items
INSERT INTO receipt_items (receipt_id, product_id, quantity, expiry_date) VALUES
  ((SELECT id FROM receipts WHERE supplier_name='Supplier A'), (SELECT id FROM products WHERE sku='SKU001'), 50, '2026-01-01'),
  ((SELECT id FROM receipts WHERE supplier_name='Supplier B'), (SELECT id FROM products WHERE sku='SKU002'), 100, '2026-02-01'),
  ((SELECT id FROM receipts WHERE supplier_name='Supplier C'), (SELECT id FROM products WHERE sku='SKU003'), 75, '2026-03-01'),
  ((SELECT id FROM receipts WHERE supplier_name='Supplier D'), (SELECT id FROM products WHERE sku='SKU004'), 40, '2026-04-01'),
  ((SELECT id FROM receipts WHERE supplier_name='Supplier E'), (SELECT id FROM products WHERE sku='SKU005'), 30, '2026-05-01');

-- 9. Deliveries
INSERT INTO deliveries (customer_name, warehouse_id, user_id, status) VALUES
  ('Customer A', (SELECT id FROM warehouses WHERE name='Central Warehouse'), (SELECT id FROM users WHERE name='Alice'), 'completed'),
  ('Customer B', (SELECT id FROM warehouses WHERE name='North Warehouse'), (SELECT id FROM users WHERE name='Bob'), 'completed'),
  ('Customer C', (SELECT id FROM warehouses WHERE name='East Warehouse'), (SELECT id FROM users WHERE name='Carol'), 'completed'),
  ('Customer D', (SELECT id FROM warehouses WHERE name='South Warehouse'), (SELECT id FROM users WHERE name='Dave'), 'completed'),
  ('Customer E', (SELECT id FROM warehouses WHERE name='West Warehouse'), (SELECT id FROM users WHERE name='Eve'), 'completed');

-- 10. Delivery Items
INSERT INTO delivery_items (delivery_id, product_id, quantity) VALUES
  ((SELECT id FROM deliveries WHERE customer_name='Customer A'), (SELECT id FROM products WHERE sku='SKU001'), 10),
  ((SELECT id FROM deliveries WHERE customer_name='Customer B'), (SELECT id FROM products WHERE sku='SKU002'), 20),
  ((SELECT id FROM deliveries WHERE customer_name='Customer C'), (SELECT id FROM products WHERE sku='SKU003'), 15),
  ((SELECT id FROM deliveries WHERE customer_name='Customer D'), (SELECT id FROM products WHERE sku='SKU004'), 8),
  ((SELECT id FROM deliveries WHERE customer_name='Customer E'), (SELECT id FROM products WHERE sku='SKU005'), 6);

-- 11. Transfers
INSERT INTO transfers (from_warehouse_id, to_warehouse_id, user_id, status) VALUES
  ((SELECT id FROM warehouses WHERE name='Central Warehouse'), (SELECT id FROM warehouses WHERE name='North Warehouse'), (SELECT id FROM users WHERE name='Alice'), 'completed'),
  ((SELECT id FROM warehouses WHERE name='North Warehouse'), (SELECT id FROM warehouses WHERE name='East Warehouse'), (SELECT id FROM users WHERE name='Bob'), 'completed'),
  ((SELECT id FROM warehouses WHERE name='East Warehouse'), (SELECT id FROM warehouses WHERE name='South Warehouse'), (SELECT id FROM users WHERE name='Carol'), 'completed'),
  ((SELECT id FROM warehouses WHERE name='South Warehouse'), (SELECT id FROM warehouses WHERE name='West Warehouse'), (SELECT id FROM users WHERE name='Dave'), 'completed'),
  ((SELECT id FROM warehouses WHERE name='West Warehouse'), (SELECT id FROM warehouses WHERE name='Central Warehouse'), (SELECT id FROM users WHERE name='Eve'), 'completed');

-- 12. Transfer Items
INSERT INTO transfer_items (transfer_id, product_id, quantity) VALUES
  ((SELECT id FROM transfers WHERE from_warehouse_id=(SELECT id FROM warehouses WHERE name='Central Warehouse') LIMIT 1), (SELECT id FROM products WHERE sku='SKU001'), 5),
  ((SELECT id FROM transfers WHERE from_warehouse_id=(SELECT id FROM warehouses WHERE name='North Warehouse') LIMIT 1), (SELECT id FROM products WHERE sku='SKU002'), 10),
  ((SELECT id FROM transfers WHERE from_warehouse_id=(SELECT id FROM warehouses WHERE name='East Warehouse') LIMIT 1), (SELECT id FROM products WHERE sku='SKU003'), 7),
  ((SELECT id FROM transfers WHERE from_warehouse_id=(SELECT id FROM warehouses WHERE name='South Warehouse') LIMIT 1), (SELECT id FROM products WHERE sku='SKU004'), 4),
  ((SELECT id FROM transfers WHERE from_warehouse_id=(SELECT id FROM warehouses WHERE name='West Warehouse') LIMIT 1), (SELECT id FROM products WHERE sku='SKU005'), 3);

-- 13. Adjustments
INSERT INTO adjustments (product_id, warehouse_id, user_id, reason, quantity_change, notes) VALUES
  ((SELECT id FROM products WHERE sku='SKU001'), (SELECT id FROM warehouses WHERE name='Central Warehouse'), (SELECT id FROM users WHERE name='Alice'), 'Damage', -2, 'Broken bottles'),
  ((SELECT id FROM products WHERE sku='SKU002'), (SELECT id FROM warehouses WHERE name='North Warehouse'), (SELECT id FROM users WHERE name='Bob'), 'Expiry', -5, 'Expired chips'),
  ((SELECT id FROM products WHERE sku='SKU003'), (SELECT id FROM warehouses WHERE name='East Warehouse'), (SELECT id FROM users WHERE name='Carol'), 'Theft', -3, 'Milk stolen'),
  ((SELECT id FROM products WHERE sku='SKU004'), (SELECT id FROM warehouses WHERE name='South Warehouse'), (SELECT id FROM users WHERE name='Dave'), 'Correction', 1, 'Inventory recount'),
  ((SELECT id FROM products WHERE sku='SKU005'), (SELECT id FROM warehouses WHERE name='West Warehouse'), (SELECT id FROM users WHERE name='Eve'), 'Damage', -1, 'Crushed bread');