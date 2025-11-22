use axum::{extract::{State, Path, Json}, http::StatusCode, response::IntoResponse};
use crate::dto::transfer_dto::{CreateTransferRequest, UpdateTransferRequest};
use crate::repository::transfer_repo;
use crate::config::database::DbPool;

pub async fn list_transfers(State(pool): State<DbPool>) -> impl IntoResponse {
    match transfer_repo::get_all(&pool).await {
        Ok(transfers) => (StatusCode::OK, Json(transfers)).into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}

pub async fn create_transfer(State(pool): State<DbPool>, Json(req): Json<CreateTransferRequest>) -> impl IntoResponse {
    match transfer_repo::create(&pool, req).await {
        Ok(transfer) => (StatusCode::CREATED, Json(transfer)).into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}

pub async fn update_transfer(State(pool): State<DbPool>, Path(id): Path<i32>, Json(req): Json<UpdateTransferRequest>) -> impl IntoResponse {
    match transfer_repo::update(&pool, id, req).await {
        Ok(transfer) => (StatusCode::OK, Json(transfer)).into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}

pub async fn delete_transfer(State(pool): State<DbPool>, Path(id): Path<i32>) -> impl IntoResponse {
    match transfer_repo::delete(&pool, id).await {
        Ok(_) => StatusCode::NO_CONTENT.into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}
