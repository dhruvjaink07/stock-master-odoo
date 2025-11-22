use axum::{extract::{State, Path, Json}, http::StatusCode, response::IntoResponse};
use crate::dto::category_dto::{CreateCategoryRequest, UpdateCategoryRequest};
use crate::repository::category_repo;
use crate::config::database::DbPool;

pub async fn list_categories(State(pool): State<DbPool>) -> impl IntoResponse {
    match category_repo::get_all(&pool).await {
        Ok(categories) => (StatusCode::OK, Json(categories)).into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}

pub async fn create_category(State(pool): State<DbPool>, Json(req): Json<CreateCategoryRequest>) -> impl IntoResponse {
    match category_repo::create(&pool, req).await {
        Ok(category) => (StatusCode::CREATED, Json(category)).into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}

pub async fn update_category(State(pool): State<DbPool>, Path(id): Path<i32>, Json(req): Json<UpdateCategoryRequest>) -> impl IntoResponse {
    match category_repo::update(&pool, id, req).await {
        Ok(category) => (StatusCode::OK, Json(category)).into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}

pub async fn delete_category(State(pool): State<DbPool>, Path(id): Path<i32>) -> impl IntoResponse {
    match category_repo::delete(&pool, id).await {
        Ok(_) => StatusCode::NO_CONTENT.into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}
