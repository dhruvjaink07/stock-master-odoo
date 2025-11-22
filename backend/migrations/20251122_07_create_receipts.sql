-- Receipts table
CREATE TABLE IF NOT EXISTS receipts (
    id SERIAL PRIMARY KEY,
    supplier_name VARCHAR(255) NOT NULL,
    warehouse_id INTEGER REFERENCES warehouses(id),
    user_id INTEGER REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Receipt items
CREATE TABLE IF NOT EXISTS receipt_items (
    id SERIAL PRIMARY KEY,
    receipt_id INTEGER REFERENCES receipts(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    expiry_date DATE,
    created_at TIMESTAMP DEFAULT NOW()
);