use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TransferDto {
    pub id: Option<i32>,
    pub from_warehouse_id: Option<i32>,
    pub to_warehouse_id: Option<i32>,
    pub user_id: Option<i32>,
    pub status: Option<String>,
    pub created_at: Option<chrono::NaiveDateTime>,
    pub updated_at: Option<chrono::NaiveDateTime>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateTransferRequest {
    pub from_warehouse_id: i32,
    pub to_warehouse_id: i32,
    pub user_id: i32,
    pub status: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateTransferRequest {
    pub from_warehouse_id: Option<i32>,
    pub to_warehouse_id: Option<i32>,
    pub user_id: Option<i32>,
    pub status: Option<String>,
}
