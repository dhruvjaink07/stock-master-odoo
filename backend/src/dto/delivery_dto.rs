use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DeliveryDto {
    pub id: Option<i32>,
    pub customer_name: Option<String>,
    pub warehouse_id: Option<i32>,
    pub user_id: Option<i32>,
    pub status: Option<String>,
    pub created_at: Option<chrono::NaiveDateTime>,
    pub updated_at: Option<chrono::NaiveDateTime>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateDeliveryRequest {
    pub customer_name: String,
    pub warehouse_id: i32,
    pub user_id: i32,
    pub status: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateDeliveryRequest {
    pub customer_name: Option<String>,
    pub warehouse_id: Option<i32>,
    pub user_id: Option<i32>,
    pub status: Option<String>,
}
