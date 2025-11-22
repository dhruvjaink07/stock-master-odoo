use axum::{extract::State, http::StatusCode, response::IntoResponse};
use crate::config::database::DbPool;

pub async fn list_moves(State(_pool): State<DbPool>) -> impl IntoResponse {
    // TODO: implement move history logic
    (StatusCode::NOT_IMPLEMENTED, "Move history endpoint not implemented yet").into_response()
}
