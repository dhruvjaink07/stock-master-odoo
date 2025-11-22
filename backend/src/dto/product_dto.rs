use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ProductDto {
    pub id: Option<i32>,
    pub sku: String,
    pub name: String,
    pub category_id: Option<i32>,
    pub unit_of_measure: String,
    pub reorder_threshold: i32,
    pub created_at: Option<chrono::NaiveDateTime>,
    pub updated_at: Option<chrono::NaiveDateTime>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateProductRequest {
    pub sku: String,
    pub name: String,
    pub category_id: Option<i32>,
    pub unit_of_measure: String,
    pub reorder_threshold: i32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateProductRequest {
    pub name: Option<String>,
    pub category_id: Option<i32>,
    pub unit_of_measure: Option<String>,
    pub reorder_threshold: Option<i32>,
}
