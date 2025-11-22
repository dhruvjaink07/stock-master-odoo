// src/middleware/auth.rs
use axum::{
    extract::{Request, State},
    http::header::AUTHORIZATION,
    middleware::Next,
    response::Response,
};
use sqlx::PgPool;

use crate::{error::Result, utils::jwt::verify_jwt};

#[derive(Clone)]
pub struct AuthUser {
    pub id: uuid::Uuid,
}

pub async fn require_auth(
    State(pool): State<PgPool>,
    mut req: Request,
    next: Next,
) -> Result<Response> {
    let auth_header = req
        .headers()
        .get(AUTHORIZATION)
        .and_then(|h| h.to_str().ok())
        .ok_or(crate::error::AppError::Unauthorized)?;

    let token = auth_header.strip_prefix("Bearer ").ok_or(crate::error::AppError::Unauthorized)?;
    let claims = verify_jwt(token)?;

    // Optional: verify user still exists
    let user_exists: (bool,) = sqlx::query_as("SELECT EXISTS(SELECT 1 FROM users WHERE id = $1)")
        .bind(claims.sub)
        .fetch_one(&pool)
        .await
        .map_err(crate::error::AppError::Sqlx)?;

    if !user_exists.0 {
        return Err(crate::error::AppError::Unauthorized.into());
    }

    req.extensions_mut().insert(AuthUser { id: claims.sub });
    Ok(next.run(req).await)
}