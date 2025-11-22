use axum::{extract::{State, Path, Json}, http::StatusCode, response::IntoResponse};
use crate::dto::product_dto::{CreateProductRequest, UpdateProductRequest};
use crate::repository::product_repo;
use crate::config::database::DbPool;

pub async fn list_products(State(pool): State<DbPool>) -> impl IntoResponse {
    match product_repo::get_all(&pool).await {
        Ok(products) => (StatusCode::OK, Json(products)).into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}

pub async fn create_product(State(pool): State<DbPool>, Json(req): Json<CreateProductRequest>) -> impl IntoResponse {
    match product_repo::create(&pool, req).await {
        Ok(product) => (StatusCode::CREATED, Json(product)).into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}

pub async fn update_product(State(pool): State<DbPool>, Path(id): Path<i32>, Json(req): Json<UpdateProductRequest>) -> impl IntoResponse {
    match product_repo::update(&pool, id, req).await {
        Ok(product) => (StatusCode::OK, Json(product)).into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}

pub async fn delete_product(State(pool): State<DbPool>, Path(id): Path<i32>) -> impl IntoResponse {
    match product_repo::delete(&pool, id).await {
        Ok(_) => StatusCode::NO_CONTENT.into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}
