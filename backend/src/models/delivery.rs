// src/models/delivery.rs
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Delivery {
    pub id: Uuid,
    pub customer_name: String,
    pub warehouse_id: Uuid,
    pub status: String,                     // draft / picked / packed / delivered / cancelled
    pub created_by: Uuid,
    pub created_at: chrono::DateTime<chrono::Utc>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct DeliveryItem {
    pub id: Uuid,
    pub delivery_id: Uuid,
    pub product_id: Uuid,
    pub quantity: rust_decimal::Decimal,
}