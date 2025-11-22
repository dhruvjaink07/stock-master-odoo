use crate::dto::product_dto::{ProductDto, CreateProductRequest, UpdateProductRequest};
use crate::config::database::DbPool;
use sqlx::Error;

pub async fn get_all(pool: &DbPool) -> Result<Vec<ProductDto>, Error> {
    let products = sqlx::query_as!(ProductDto,
        r#"SELECT id, sku, name, category_id, unit_of_measure, reorder_threshold, created_at, updated_at FROM products ORDER BY id"#
    )
    .fetch_all(pool)
    .await?;
    Ok(products)
}

pub async fn create(pool: &DbPool, req: CreateProductRequest) -> Result<ProductDto, Error> {
    let rec = sqlx::query_as!(ProductDto,
        r#"INSERT INTO products (sku, name, category_id, unit_of_measure, reorder_threshold) VALUES ($1, $2, $3, $4, $5)
        RETURNING id, sku, name, category_id, unit_of_measure, reorder_threshold, created_at, updated_at"#,
        req.sku, req.name, req.category_id, req.unit_of_measure, req.reorder_threshold
    )
    .fetch_one(pool)
    .await?;
    Ok(rec)
}

pub async fn update(pool: &DbPool, id: i32, req: UpdateProductRequest) -> Result<ProductDto, Error> {
    let rec = sqlx::query_as!(ProductDto,
        r#"UPDATE products SET name = COALESCE($1, name), category_id = COALESCE($2, category_id), unit_of_measure = COALESCE($3, unit_of_measure), reorder_threshold = COALESCE($4, reorder_threshold), updated_at = NOW()
        WHERE id = $5 RETURNING id, sku, name, category_id, unit_of_measure, reorder_threshold, created_at, updated_at"#,
        req.name, req.category_id, req.unit_of_measure, req.reorder_threshold, id
    )
    .fetch_one(pool)
    .await?;
    Ok(rec)
}

pub async fn delete(pool: &DbPool, id: i32) -> Result<(), Error> {
    sqlx::query!("DELETE FROM products WHERE id = $1", id)
        .execute(pool)
        .await?;
    Ok(())
}
