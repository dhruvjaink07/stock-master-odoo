use axum::{Router, routing::{get, post, put, delete}};
use crate::handlers;
use crate::config::database::DbPool;
use axum::extract::State;

pub fn create_router(pool: DbPool) -> Router {
    Router::new()
        .route("/api/v1/warehouses", get(handlers::warehouses::list_warehouses).post(handlers::warehouses::create_warehouse))
        .route("/api/v1/warehouses/:id", put(handlers::warehouses::update_warehouse).delete(handlers::warehouses::delete_warehouse))
        .route("/api/v1/products", get(handlers::products::list_products).post(handlers::products::create_product))
        .route("/api/v1/products/:id", put(handlers::products::update_product).delete(handlers::products::delete_product))
        .route("/api/v1/users", get(handlers::users::list_users).post(handlers::users::create_user))
        .route("/api/v1/users/:id", put(handlers::users::update_user).delete(handlers::users::delete_user))
        .route("/api/v1/receipts", get(handlers::receipts::list_receipts).post(handlers::receipts::create_receipt))
        .route("/api/v1/receipts/:id", put(handlers::receipts::update_receipt).delete(handlers::receipts::delete_receipt))
        // Add more routes here
        .with_state(pool)
}