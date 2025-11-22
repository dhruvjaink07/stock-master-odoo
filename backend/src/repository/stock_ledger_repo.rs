use serde::{Deserialize, Serialize};
use crate::config::database::DbPool;
use sqlx::Error;

#[derive(Debug, Serialize, Deserialize)]
pub struct StockLedgerDto {
    pub id: Option<i32>,
    pub product_id: Option<i32>,
    pub warehouse_id: Option<i32>,
    pub user_id: Option<i32>,
    pub movement_type: Option<String>,
    pub reference_id: Option<i32>,
    pub reference_type: Option<String>,
    pub quantity_change: Option<i32>,
    pub new_balance: Option<i32>,
    pub notes: Option<String>,
    pub created_at: Option<chrono::NaiveDateTime>,
}

#[derive(Debug, Deserialize)]
pub struct StockLedgerFilter {
    pub product_id: Option<i32>,
    pub warehouse_id: Option<i32>,
    pub movement_type: Option<String>,
    pub date_from: Option<chrono::NaiveDate>,
    pub date_to: Option<chrono::NaiveDate>,
}

pub async fn get_all(pool: &DbPool, filter: StockLedgerFilter) -> Result<Vec<StockLedgerDto>, Error> {
    // For simplicity, this is a basic query. You can expand it for more advanced filtering.
    let entries = sqlx::query_as!(StockLedgerDto,
        r#"SELECT id, product_id, warehouse_id, user_id, movement_type, reference_id, reference_type, quantity_change, new_balance, notes, created_at FROM stock_ledger ORDER BY created_at DESC"#
    )
    .fetch_all(pool)
    .await?;
    Ok(entries)
}
