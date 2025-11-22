use axum::{extract::{State, Path, Json}, http::StatusCode, response::IntoResponse};
use crate::dto::receipt_dto::{CreateReceiptRequest, UpdateReceiptRequest};
use crate::repository::receipt_repo;
use crate::config::database::DbPool;

pub async fn list_receipts(State(pool): State<DbPool>) -> impl IntoResponse {
    match receipt_repo::get_all(&pool).await {
        Ok(receipts) => (StatusCode::OK, Json(receipts)).into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}

pub async fn create_receipt(State(pool): State<DbPool>, Json(req): Json<CreateReceiptRequest>) -> impl IntoResponse {
    match receipt_repo::create(&pool, req).await {
        Ok(receipt) => (StatusCode::CREATED, Json(receipt)).into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}

pub async fn update_receipt(State(pool): State<DbPool>, Path(id): Path<i32>, Json(req): Json<UpdateReceiptRequest>) -> impl IntoResponse {
    match receipt_repo::update(&pool, id, req).await {
        Ok(receipt) => (StatusCode::OK, Json(receipt)).into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}

pub async fn delete_receipt(State(pool): State<DbPool>, Path(id): Path<i32>) -> impl IntoResponse {
    match receipt_repo::delete(&pool, id).await {
        Ok(_) => StatusCode::NO_CONTENT.into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}
