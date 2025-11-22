-- Stock ledger (move history)
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