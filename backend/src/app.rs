// src/app.rs
use axum::{routing::get, Router};
use tower_http::cors::CorsLayer;
use crate::config::database;
use crate::router;

pub async fn create_app() -> Router {
    let pool = database::get_pool().await;
    let app = router::create_router(pool)
        .route("/api/v1/health", get(|| async { "ok" }))
        .layer(CorsLayer::permissive());
    app
}