use crate::config::database::DbPool;
use crate::models::product_stock::ProductStock;
use sqlx::Error;
use uuid::Uuid;


pub async fn get_all(pool: &DbPool) -> Result<Vec<ProductStock>, Error> {
    let stocks = sqlx::query_as::<_, ProductStock>(
        r#"SELECT product_id, warehouse_id, quantity FROM product_stock"#
    )
    .fetch_all(pool)
    .await?;
    Ok(stocks)
}


pub async fn get_by_product(pool: &DbPool, product_id: Uuid) -> Result<Vec<ProductStock>, Error> {
    let stocks = sqlx::query_as::<_, ProductStock>(
        r#"SELECT product_id, warehouse_id, quantity FROM product_stock WHERE product_id = $1"#
    )
    .bind(product_id)
    .fetch_all(pool)
    .await?;
    Ok(stocks)
}


pub async fn get_by_warehouse(pool: &DbPool, warehouse_id: Uuid) -> Result<Vec<ProductStock>, Error> {
    let stocks = sqlx::query_as::<_, ProductStock>(
        r#"SELECT product_id, warehouse_id, quantity FROM product_stock WHERE warehouse_id = $1"#
    )
    .bind(warehouse_id)
    .fetch_all(pool)
    .await?;
    Ok(stocks)
}
