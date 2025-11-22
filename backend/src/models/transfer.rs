// src/models/transfer.rs
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Transfer {
    pub id: Uuid,
    pub from_warehouse_id: Uuid,
    pub to_warehouse_id: Uuid,
    pub status: String,                     // draft / executed / cancelled
    pub created_by: Uuid,
    pub created_at: chrono::DateTime<chrono::Utc>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct TransferItem {
    pub id: Uuid,
    pub transfer_id: Uuid,
    pub product_id: Uuid,
    pub quantity: rust_decimal::Decimal,
}