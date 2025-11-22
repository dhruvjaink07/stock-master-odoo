use axum::{extract::{State, Query}, http::StatusCode, response::IntoResponse};
use crate::repository::stock_ledger_repo;
use crate::config::database::DbPool;

pub async fn list_stock_ledger(State(pool): State<DbPool>, Query(params): Query<stock_ledger_repo::StockLedgerFilter>) -> impl IntoResponse {
    match stock_ledger_repo::get_all(&pool, params).await {
        Ok(entries) => (StatusCode::OK, axum::Json(entries)).into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}
