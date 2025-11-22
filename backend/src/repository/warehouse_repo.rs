use crate::dto::warehouse_dto::{WarehouseDto, CreateWarehouseRequest, UpdateWarehouseRequest};
use crate::config::database::DbPool;
use sqlx::Error;

pub async fn get_all(pool: &DbPool) -> Result<Vec<WarehouseDto>, Error> {
    let warehouses = sqlx::query_as!(WarehouseDto,
        r#"SELECT id, name, location, created_at, updated_at FROM warehouses ORDER BY id"#
    )
    .fetch_all(pool)
    .await?;
    Ok(warehouses)
}

pub async fn create(pool: &DbPool, req: CreateWarehouseRequest) -> Result<WarehouseDto, Error> {
    let rec = sqlx::query_as!(WarehouseDto,
        r#"INSERT INTO warehouses (name, location) VALUES ($1, $2)
        RETURNING id, name, location, created_at, updated_at"#,
        req.name, req.location
    )
    .fetch_one(pool)
    .await?;
    Ok(rec)
}

pub async fn update(pool: &DbPool, id: i32, req: UpdateWarehouseRequest) -> Result<WarehouseDto, Error> {
    let rec = sqlx::query_as!(WarehouseDto,
        r#"UPDATE warehouses SET name = COALESCE($1, name), location = COALESCE($2, location), updated_at = NOW()
        WHERE id = $3 RETURNING id, name, location, created_at, updated_at"#,
        req.name, req.location, id
    )
    .fetch_one(pool)
    .await?;
    Ok(rec)
}

pub async fn delete(pool: &DbPool, id: i32) -> Result<(), Error> {
    sqlx::query!("DELETE FROM warehouses WHERE id = $1", id)
        .execute(pool)
        .await?;
    Ok(())
}
