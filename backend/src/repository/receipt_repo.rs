use crate::dto::receipt_dto::{ReceiptDto, CreateReceiptRequest, UpdateReceiptRequest};
use crate::config::database::DbPool;
use sqlx::Error;

pub async fn get_all(pool: &DbPool) -> Result<Vec<ReceiptDto>, Error> {
    let receipts = sqlx::query_as!(ReceiptDto,
        r#"SELECT id, supplier_name, warehouse_id, user_id, status, created_at, updated_at FROM receipts ORDER BY id"#
    )
    .fetch_all(pool)
    .await?;
    Ok(receipts)
}

pub async fn create(pool: &DbPool, req: CreateReceiptRequest) -> Result<ReceiptDto, Error> {
    let rec = sqlx::query_as!(ReceiptDto,
        r#"INSERT INTO receipts (supplier_name, warehouse_id, user_id, status) VALUES ($1, $2, $3, $4)
        RETURNING id, supplier_name, warehouse_id, user_id, status, created_at, updated_at"#,
        req.supplier_name, req.warehouse_id, req.user_id, req.status
    )
    .fetch_one(pool)
    .await?;
    Ok(rec)
}

pub async fn update(pool: &DbPool, id: i32, req: UpdateReceiptRequest) -> Result<ReceiptDto, Error> {
    let rec = sqlx::query_as!(ReceiptDto,
        r#"UPDATE receipts SET supplier_name = COALESCE($1, supplier_name), warehouse_id = COALESCE($2, warehouse_id), user_id = COALESCE($3, user_id), status = COALESCE($4, status), updated_at = NOW()
        WHERE id = $5 RETURNING id, supplier_name, warehouse_id, user_id, status, created_at, updated_at"#,
        req.supplier_name, req.warehouse_id, req.user_id, req.status, id
    )
    .fetch_one(pool)
    .await?;
    Ok(rec)
}

pub async fn delete(pool: &DbPool, id: i32) -> Result<(), Error> {
    sqlx::query!("DELETE FROM receipts WHERE id = $1", id)
        .execute(pool)
        .await?;
    Ok(())
}
