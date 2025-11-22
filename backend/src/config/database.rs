// src/config/database.rs
use sqlx::PgPool;
pub type DbPool = PgPool;

pub async fn get_pool() -> DbPool {
    let database_url = std::env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set in .env");

    PgPool::connect(&database_url)
        .await
        .expect("Failed to connect to PostgreSQL")
}