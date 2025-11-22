use std::clone;
// src/error/app_error.rs
use axum::{
    response::{IntoResponse, Json},
    http::StatusCode,
};
use serde_json::json;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum AppError {
    #[error("Database error: {0}")]
    Sqlx(#[from] sqlx::Error),

    #[error("Invalid credentials")]
    InvalidCredentials,

    #[error("Unauthorized")]
    Unauthorized,

    #[error("JWT error: {0}")]
    Jwt(#[from] jsonwebtoken::errors::Error),

    #[error("Bcrypt error: {0}")]
    Bcrypt(#[from] bcrypt::BcryptError),

    #[error("Not found: {0}")]
    NotFound(String),

    #[error("Bad request: {0}")]
    BadRequest(String),

    #[error("Internal server error")]
    Internal,
}

pub type Result<T> = std::result::Result<T, AppError>;

// Automatic conversion to HTTP response
impl IntoResponse for AppError {
    fn into_response(self) -> axum::response::Response {
        let (status, message): (StatusCode, String) = match self {
            AppError::InvalidCredentials | AppError::Unauthorized => {
                (StatusCode::UNAUTHORIZED, "Invalid credentials".to_string())
            }
            AppError::NotFound(_) => (StatusCode::NOT_FOUND, "Resource not found".to_string()),
            AppError::BadRequest(message) => (StatusCode::BAD_REQUEST, message),
            AppError::Internal | AppError::Sqlx(_) | AppError::Jwt(_) | AppError::Bcrypt(_) => {
                (StatusCode::INTERNAL_SERVER_ERROR, "Internal server error".to_string())
            }
        };

        let body = Json(json!({
            "error": message
        }));

        (status, body).into_response()
    }
}
