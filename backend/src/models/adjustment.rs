// src/models/adjustment.rs
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Adjustment {
    pub id: Uuid,
    pub product_id: Uuid,
    pub warehouse_id: Uuid,
    pub reason: String,                     // damage / expiry / theft / correction / count
    pub quantity_change: rust_decimal::Decimal,
    pub counted_quantity: Option<rust_decimal::Decimal>,
    pub notes: Option<String>,
    pub created_by: Uuid,
    pub created_at: chrono::DateTime<chrono::Utc>,
}