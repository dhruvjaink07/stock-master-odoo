use axum::{extract::{State, Path, Json}, http::StatusCode, response::IntoResponse};
use crate::dto::delivery_dto::{CreateDeliveryRequest, UpdateDeliveryRequest};
use crate::repository::delivery_repo;
use crate::config::database::DbPool;

pub async fn list_deliveries(State(pool): State<DbPool>) -> impl IntoResponse {
    match delivery_repo::get_all(&pool).await {
        Ok(deliveries) => (StatusCode::OK, Json(deliveries)).into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}

pub async fn create_delivery(State(pool): State<DbPool>, Json(req): Json<CreateDeliveryRequest>) -> impl IntoResponse {
    match delivery_repo::create(&pool, req).await {
        Ok(delivery) => (StatusCode::CREATED, Json(delivery)).into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}

pub async fn update_delivery(State(pool): State<DbPool>, Path(id): Path<i32>, Json(req): Json<UpdateDeliveryRequest>) -> impl IntoResponse {
    match delivery_repo::update(&pool, id, req).await {
        Ok(delivery) => (StatusCode::OK, Json(delivery)).into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}

pub async fn delete_delivery(State(pool): State<DbPool>, Path(id): Path<i32>) -> impl IntoResponse {
    match delivery_repo::delete(&pool, id).await {
        Ok(_) => StatusCode::NO_CONTENT.into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}
