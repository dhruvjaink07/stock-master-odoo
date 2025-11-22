// src/main.rs

mod app;
mod config;
mod error;
mod utils;
mod middleware;
mod models;
mod handlers;
mod repository;
mod dto;
mod router;

use tokio::net::TcpListener;

#[tokio::main]
async fn main() {
    // Load .env file (DATABASE_URL, PORT, JWT secrets, etc.)
    dotenvy::dotenv().ok();

    // Pretty logs in terminal
    tracing_subscriber::fmt::init();

    // Build the Axum router with DB pool inside
    let app = app::create_app().await;

    // Port configuration
    let port = std::env::var("PORT")
        .unwrap_or_else(|_| "4000".to_string())
        .parse::<u16>()
        .expect("PORT must be a valid number");

    let addr = format!("0.0.0.0:{port}");

    println!("Server running at http://127.0.0.1:{port}");
    println!("Health check: curl http://127.0.0.1:{port}/api/v1/health");

    // Modern way: TcpListener + axum::serve
    let listener = TcpListener::bind(&addr)
        .await
        .unwrap_or_else(|e| panic!("Failed to bind to {addr}: {e}"));

    axum::serve(listener, app.into_make_service())
        .await
        .unwrap_or_else(|e| panic!("Server error: {e}"));
}