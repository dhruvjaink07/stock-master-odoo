use crate::dto::transfer_dto::{TransferDto, CreateTransferRequest, UpdateTransferRequest};
use crate::config::database::DbPool;
use sqlx::Error;

pub async fn get_all(pool: &DbPool) -> Result<Vec<TransferDto>, Error> {
    let transfers = sqlx::query_as!(TransferDto,
        r#"SELECT id, from_warehouse_id, to_warehouse_id, user_id, status, created_at, updated_at FROM transfers ORDER BY id"#
    )
    .fetch_all(pool)
    .await?;
    Ok(transfers)
}

pub async fn create(pool: &DbPool, req: CreateTransferRequest) -> Result<TransferDto, Error> {
    let rec = sqlx::query_as!(TransferDto,
        r#"INSERT INTO transfers (from_warehouse_id, to_warehouse_id, user_id, status) VALUES ($1, $2, $3, $4)
        RETURNING id, from_warehouse_id, to_warehouse_id, user_id, status, created_at, updated_at"#,
        req.from_warehouse_id, req.to_warehouse_id, req.user_id, req.status.unwrap_or("".to_string())
    )
    .fetch_one(pool)
    .await?;
    Ok(rec)
}

pub async fn update(pool: &DbPool, id: i32, req: UpdateTransferRequest) -> Result<TransferDto, Error> {
    let rec = sqlx::query_as!(TransferDto,
        r#"UPDATE transfers SET from_warehouse_id = COALESCE($1, from_warehouse_id), to_warehouse_id = COALESCE($2, to_warehouse_id), user_id = COALESCE($3, user_id), status = COALESCE($4, status), updated_at = NOW()
        WHERE id = $5 RETURNING id, from_warehouse_id, to_warehouse_id, user_id, status, created_at, updated_at"#,
        req.from_warehouse_id, req.to_warehouse_id, req.user_id, req.status.unwrap_or("".to_string()), id
    )
    .fetch_one(pool)
    .await?;
    Ok(rec)
}

pub async fn delete(pool: &DbPool, id: i32) -> Result<(), Error> {
    sqlx::query!("DELETE FROM transfers WHERE id = $1", id)
        .execute(pool)
        .await?;
    Ok(())
}
