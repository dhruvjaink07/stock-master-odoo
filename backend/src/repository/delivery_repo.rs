use crate::dto::delivery_dto::{DeliveryDto, CreateDeliveryRequest, UpdateDeliveryRequest};
use crate::config::database::DbPool;
use sqlx::Error;

pub async fn get_all(pool: &DbPool) -> Result<Vec<DeliveryDto>, Error> {
    let deliveries = sqlx::query_as!(DeliveryDto,
        r#"SELECT id, customer_name, warehouse_id, user_id, status, created_at, updated_at FROM deliveries ORDER BY id"#
    )
    .fetch_all(pool)
    .await?;
    Ok(deliveries)
}

pub async fn create(pool: &DbPool, req: CreateDeliveryRequest) -> Result<DeliveryDto, Error> {
    let rec = sqlx::query_as!(DeliveryDto,
        r#"INSERT INTO deliveries (customer_name, warehouse_id, user_id, status) VALUES ($1, $2, $3, $4)
        RETURNING id, customer_name, warehouse_id, user_id, status, created_at, updated_at"#,
        req.customer_name, req.warehouse_id, req.user_id, req.status.unwrap_or("".to_string())
    )
    .fetch_one(pool)
    .await?;
    Ok(rec)
}

pub async fn update(pool: &DbPool, id: i32, req: UpdateDeliveryRequest) -> Result<DeliveryDto, Error> {
    let rec = sqlx::query_as!(DeliveryDto,
        r#"UPDATE deliveries SET customer_name = COALESCE($1, customer_name), warehouse_id = COALESCE($2, warehouse_id), user_id = COALESCE($3, user_id), status = COALESCE($4, status), updated_at = NOW()
        WHERE id = $5 RETURNING id, customer_name, warehouse_id, user_id, status, created_at, updated_at"#,
        req.customer_name, req.warehouse_id, req.user_id, req.status.unwrap_or("".to_string()), id
    )
    .fetch_one(pool)
    .await?;
    Ok(rec)
}

pub async fn delete(pool: &DbPool, id: i32) -> Result<(), Error> {
    sqlx::query!("DELETE FROM deliveries WHERE id = $1", id)
        .execute(pool)
        .await?;
    Ok(())
}
