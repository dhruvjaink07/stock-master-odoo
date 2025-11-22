use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ReceiptDto {
    pub id: Option<i32>,
    pub supplier_name: String,
    pub warehouse_id: i32,
    pub user_id: i32,
    pub status: Option<String>,
    pub created_at: Option<chrono::NaiveDateTime>,
    pub updated_at: Option<chrono::NaiveDateTime>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateReceiptRequest {
    pub supplier_name: String,
    pub warehouse_id: i32,
    pub user_id: i32,
    pub status: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateReceiptRequest {
    pub supplier_name: Option<String>,
    pub warehouse_id: Option<i32>,
    pub user_id: Option<i32>,
    pub status: Option<String>,
}
