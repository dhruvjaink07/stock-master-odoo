// src/models/product_stock.rs
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct ProductStock {
    pub product_id: Uuid,
    pub warehouse_id: Uuid,
    pub quantity: rust_decimal::Decimal,  // use Decimal for precision (Kg, Liters)
}