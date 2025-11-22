use axum::{extract::{State, Path, Json}, http::StatusCode, response::IntoResponse};
use crate::dto::warehouse_dto::{CreateWarehouseRequest, UpdateWarehouseRequest};
use crate::repository::warehouse_repo;
use crate::config::database::DbPool;

pub async fn list_warehouses(
    State(pool): State<DbPool>,
) -> impl IntoResponse {
    match warehouse_repo::get_all(&pool).await {
        Ok(warehouses) => (StatusCode::OK, Json(warehouses)).into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}

pub async fn create_warehouse(
    State(pool): State<DbPool>,
    Json(req): Json<CreateWarehouseRequest>,
) -> impl IntoResponse {
    match warehouse_repo::create(&pool, req).await {
        Ok(warehouse) => (StatusCode::CREATED, Json(warehouse)).into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}

pub async fn update_warehouse(
    State(pool): State<DbPool>,
    Path(id): Path<i32>,
    Json(req): Json<UpdateWarehouseRequest>,
) -> impl IntoResponse {
    match warehouse_repo::update(&pool, id, req).await {
        Ok(warehouse) => (StatusCode::OK, Json(warehouse)).into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}

pub async fn delete_warehouse(
    State(pool): State<DbPool>,
    Path(id): Path<i32>,
) -> impl IntoResponse {
    match warehouse_repo::delete(&pool, id).await {
        Ok(_) => StatusCode::NO_CONTENT.into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}
