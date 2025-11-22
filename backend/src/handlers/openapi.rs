use axum::{http::StatusCode, response::IntoResponse};

pub async fn spec() -> impl IntoResponse {
    // TODO: return OpenAPI spec JSON
    (StatusCode::NOT_IMPLEMENTED, "OpenAPI spec endpoint not implemented yet").into_response()
}
