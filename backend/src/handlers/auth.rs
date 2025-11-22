use axum::{extract::{State, Json}, http::StatusCode, response::IntoResponse};
use crate::services::auth_service;
use crate::config::database::DbPool;
use crate::dto::auth_dto::{RegisterRequest, LoginRequest};

pub async fn register(State(pool): State<DbPool>, Json(req): Json<RegisterRequest>) -> impl IntoResponse {
    match auth_service::register_user(&pool, req).await {
        Ok(user) => (StatusCode::CREATED, axum::Json(user)).into_response(),
        Err(e) => (StatusCode::BAD_REQUEST, e.to_string()).into_response(),
    }
}

pub async fn login(State(pool): State<DbPool>, Json(req): Json<LoginRequest>) -> impl IntoResponse {
    match auth_service::login_user(&pool, req).await {
        Ok(token) => (StatusCode::OK, axum::Json(token)).into_response(),
        Err(e) => (StatusCode::UNAUTHORIZED, e.to_string()).into_response(),
    }
}
