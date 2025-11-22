use crate::dto::adjustment_dto::{AdjustmentDto, CreateAdjustmentRequest, UpdateAdjustmentRequest};
use crate::config::database::DbPool;
use sqlx::Error;

pub async fn get_all(pool: &DbPool) -> Result<Vec<AdjustmentDto>, Error> {
    let adjustments = sqlx::query_as!(AdjustmentDto,
        r#"SELECT id, product_id, warehouse_id, user_id, reason, quantity_change, notes, created_at, updated_at FROM adjustments ORDER BY id"#
    )
    .fetch_all(pool)
    .await?;
    Ok(adjustments)
}

pub async fn create(pool: &DbPool, req: CreateAdjustmentRequest) -> Result<AdjustmentDto, Error> {
    let rec = sqlx::query_as!(AdjustmentDto,
        r#"INSERT INTO adjustments (product_id, warehouse_id, user_id, reason, quantity_change, notes) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, product_id, warehouse_id, user_id, reason, quantity_change, notes, created_at, updated_at"#,
        req.product_id, req.warehouse_id, req.user_id, req.reason, req.quantity_change, req.notes
    )
    .fetch_one(pool)
    .await?;
    Ok(rec)
}

pub async fn update(pool: &DbPool, id: i32, req: UpdateAdjustmentRequest) -> Result<AdjustmentDto, Error> {
    let rec = sqlx::query_as!(AdjustmentDto,
        r#"UPDATE adjustments SET reason = COALESCE($1, reason), quantity_change = COALESCE($2, quantity_change), notes = COALESCE($3, notes), updated_at = NOW()
        WHERE id = $4 RETURNING id, product_id, warehouse_id, user_id, reason, quantity_change, notes, created_at, updated_at"#,
        req.reason, req.quantity_change, req.notes, id
    )
    .fetch_one(pool)
    .await?;
    Ok(rec)
}

pub async fn delete(pool: &DbPool, id: i32) -> Result<(), Error> {
    sqlx::query!("DELETE FROM adjustments WHERE id = $1", id)
        .execute(pool)
        .await?;
    Ok(())
}
