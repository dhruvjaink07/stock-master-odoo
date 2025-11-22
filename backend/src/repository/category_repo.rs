use crate::dto::category_dto::{CategoryDto, CreateCategoryRequest, UpdateCategoryRequest};
use crate::config::database::DbPool;
use sqlx::Error;

pub async fn get_all(pool: &DbPool) -> Result<Vec<CategoryDto>, Error> {
    let categories = sqlx::query_as!(CategoryDto,
        r#"SELECT id, name, created_at, updated_at FROM categories ORDER BY id"#
    )
    .fetch_all(pool)
    .await?;
    Ok(categories)
}

pub async fn create(pool: &DbPool, req: CreateCategoryRequest) -> Result<CategoryDto, Error> {
    let rec = sqlx::query_as!(CategoryDto,
        r#"INSERT INTO categories (name) VALUES ($1)
        RETURNING id, name, created_at, updated_at"#,
        req.name
    )
    .fetch_one(pool)
    .await?;
    Ok(rec)
}

pub async fn update(pool: &DbPool, id: i32, req: UpdateCategoryRequest) -> Result<CategoryDto, Error> {
    let rec = sqlx::query_as!(CategoryDto,
        r#"UPDATE categories SET name = COALESCE($1, name), updated_at = NOW()
        WHERE id = $2 RETURNING id, name, created_at, updated_at"#,
        req.name, id
    )
    .fetch_one(pool)
    .await?;
    Ok(rec)
}

pub async fn delete(pool: &DbPool, id: i32) -> Result<(), Error> {
    sqlx::query!("DELETE FROM categories WHERE id = $1", id)
        .execute(pool)
        .await?;
    Ok(())
}
