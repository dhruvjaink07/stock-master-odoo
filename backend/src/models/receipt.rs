// src/models/receipt.rs
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Receipt {
    pub id: Uuid,
    pub supplier_name: String,
    pub warehouse_id: Uuid,
    pub status: String,                     // draft / validated / cancelled
    pub created_by: Uuid,
    pub created_at: chrono::DateTime<chrono::Utc>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct ReceiptItem {
    pub id: Uuid,
    pub receipt_id: Uuid,
    pub product_id: Uuid,
    pub quantity: rust_decimal::Decimal,
    pub expiry_date: Option<chrono::NaiveDate>,
}