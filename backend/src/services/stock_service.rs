use crate::repository::product_stock_repo;
use crate::models::product_stock::ProductStock;
use crate::config::database::DbPool;
use sqlx::Error;

pub async fn get_current_stock(pool: &DbPool) -> Result<Vec<ProductStock>, Error> {
    product_stock_repo::get_all(pool).await
}

pub async fn get_stock_by_product(pool: &DbPool, product_id: uuid::Uuid) -> Result<Vec<ProductStock>, Error> {
    product_stock_repo::get_by_product(pool, product_id).await
}

pub async fn get_stock_by_warehouse(pool: &DbPool, warehouse_id: uuid::Uuid) -> Result<Vec<ProductStock>, Error> {
        product_stock_repo::get_by_warehouse(pool, warehouse_id).await
    }
