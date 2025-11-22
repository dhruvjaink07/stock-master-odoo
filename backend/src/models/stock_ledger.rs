// src/models/stock_ledger.rs
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct StockLedger {
    pub id: i64,
    pub product_id: Uuid,
    pub warehouse_id: Uuid,
    pub reference_type: String,        // receipt, delivery, transfer, adjustment
    pub reference_id: Uuid,
    pub quantity_change: rust_decimal::Decimal,
    pub new_quantity: rust_decimal::Decimal,
    pub performed_by: Uuid,
    pub notes: Option<String>,
    pub created_at: chrono::DateTime<chrono::Utc>,
}