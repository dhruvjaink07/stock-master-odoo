use axum::{extract::{State, Path, Json}, http::StatusCode, response::IntoResponse};
use crate::dto::adjustment_dto::{CreateAdjustmentRequest, UpdateAdjustmentRequest};
use crate::repository::adjustment_repo;
use crate::config::database::DbPool;

pub async fn list_adjustments(State(pool): State<DbPool>) -> impl IntoResponse {
    match adjustment_repo::get_all(&pool).await {
        Ok(adjustments) => (StatusCode::OK, Json(adjustments)).into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}

pub async fn create_adjustment(State(pool): State<DbPool>, Json(req): Json<CreateAdjustmentRequest>) -> impl IntoResponse {
    match adjustment_repo::create(&pool, req).await {
        Ok(adjustment) => (StatusCode::CREATED, Json(adjustment)).into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}

pub async fn update_adjustment(State(pool): State<DbPool>, Path(id): Path<i32>, Json(req): Json<UpdateAdjustmentRequest>) -> impl IntoResponse {
    match adjustment_repo::update(&pool, id, req).await {
        Ok(adjustment) => (StatusCode::OK, Json(adjustment)).into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}

pub async fn delete_adjustment(State(pool): State<DbPool>, Path(id): Path<i32>) -> impl IntoResponse {
    match adjustment_repo::delete(&pool, id).await {
        Ok(_) => StatusCode::NO_CONTENT.into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}
