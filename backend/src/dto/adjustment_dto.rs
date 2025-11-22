use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AdjustmentDto {
    pub id: Option<i32>,
    pub product_id: Option<i32>,
    pub warehouse_id: Option<i32>,
    pub user_id: Option<i32>,
    pub reason: Option<String>,
    pub quantity_change: Option<i32>,
    pub notes: Option<String>,
    pub created_at: Option<chrono::NaiveDateTime>,
    pub updated_at: Option<chrono::NaiveDateTime>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateAdjustmentRequest {
    pub product_id: i32,
    pub warehouse_id: i32,
    pub user_id: i32,
    pub reason: String,
    pub quantity_change: i32,
    pub notes: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateAdjustmentRequest {
    pub reason: Option<String>,
    pub quantity_change: Option<i32>,
    pub notes: Option<String>,
}
