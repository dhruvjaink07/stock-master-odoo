-- Adjustments table
CREATE TABLE IF NOT EXISTS adjustments (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    warehouse_id INTEGER REFERENCES warehouses(id),
    user_id INTEGER REFERENCES users(id),
    reason VARCHAR(50) NOT NULL, -- Damage, Expiry, Theft, Correction
    quantity_change INTEGER NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);