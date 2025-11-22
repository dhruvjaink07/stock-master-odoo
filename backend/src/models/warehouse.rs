// src/models/warehouse.rs
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Warehouse {
    pub id: Uuid,
    pub name: String,
    pub is_default: bool,
    pub created_at: chrono::DateTime<chrono::Utc>,
}