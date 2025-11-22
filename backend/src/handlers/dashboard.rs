use axum::{extract::State, http::StatusCode, response::IntoResponse};
use crate::config::database::DbPool;

pub async fn summary(State(_pool): State<DbPool>) -> impl IntoResponse {
    // TODO: implement dashboard summary logic
    (StatusCode::NOT_IMPLEMENTED, "Dashboard summary endpoint not implemented yet").into_response()
}
