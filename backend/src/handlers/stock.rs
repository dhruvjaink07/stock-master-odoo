use axum::{extract::{State, Path}, http::StatusCode, response::IntoResponse, Json};
use uuid::Uuid;
use crate::services::stock_service;
use crate::config::database::DbPool;

pub async fn current_stock(State(pool): State<DbPool>) -> impl IntoResponse {
    match stock_service::get_current_stock(&pool).await {
        Ok(stocks) => Json::<Vec<crate::models::product_stock::ProductStock>>(stocks).into_response(),
        Err(_) => (StatusCode::INTERNAL_SERVER_ERROR, "Failed to fetch current stock").into_response(),
    }
}

pub async fn stock_by_product(State(pool): State<DbPool>, Path(product_id): Path<String>) -> impl IntoResponse {
    match Uuid::parse_str(&product_id) {
        Ok(uuid) => match stock_service::get_stock_by_product(&pool, uuid).await {
            Ok(stocks) => Json::<Vec<crate::models::product_stock::ProductStock>>(stocks).into_response(),
            Err(_) => (StatusCode::INTERNAL_SERVER_ERROR, "Failed to fetch stock by product").into_response(),
        },
        Err(_) => (StatusCode::BAD_REQUEST, "Invalid product_id").into_response(),
    }
}

pub async fn stock_by_warehouse(State(pool): State<DbPool>, Path(warehouse_id): Path<String>) -> impl IntoResponse {
    match Uuid::parse_str(&warehouse_id) {
        Ok(uuid) => match stock_service::get_stock_by_warehouse(&pool, uuid).await {
            Ok(stocks) => Json::<Vec<crate::models::product_stock::ProductStock>>(stocks).into_response(),
            Err(_) => (StatusCode::INTERNAL_SERVER_ERROR, "Failed to fetch stock by warehouse").into_response(),
        },
        Err(_) => (StatusCode::BAD_REQUEST, "Invalid warehouse_id").into_response(),
    }
}
