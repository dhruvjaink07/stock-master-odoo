use axum::{extract::{State, Path, Json}, http::StatusCode, response::IntoResponse};
use crate::dto::user_dto::{CreateUserRequest, UpdateUserRequest};
use crate::repository::user_repo;
use crate::config::database::DbPool;

pub async fn list_users(State(pool): State<DbPool>) -> impl IntoResponse {
    match user_repo::get_all(&pool).await {
        Ok(users) => (StatusCode::OK, Json(users)).into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}

pub async fn create_user(State(pool): State<DbPool>, Json(req): Json<CreateUserRequest>) -> impl IntoResponse {
    match user_repo::create(&pool, req).await {
        Ok(user) => (StatusCode::CREATED, Json(user)).into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}

pub async fn update_user(State(pool): State<DbPool>, Path(id): Path<i32>, Json(req): Json<UpdateUserRequest>) -> impl IntoResponse {
    match user_repo::update(&pool, id, req).await {
        Ok(user) => (StatusCode::OK, Json(user)).into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}

pub async fn delete_user(State(pool): State<DbPool>, Path(id): Path<i32>) -> impl IntoResponse {
    match user_repo::delete(&pool, id).await {
        Ok(_) => StatusCode::NO_CONTENT.into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}
