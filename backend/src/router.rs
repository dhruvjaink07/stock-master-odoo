use axum::{Router, routing::{get, post, put, delete}};
use crate::handlers;
use crate::config::database::DbPool;
use axum::extract::State;

pub fn create_router(pool: DbPool) -> Router {
    Router::new()
        // Auth
        .route("/api/v1/auth/register", post(handlers::auth::register))
        .route("/api/v1/auth/login", post(handlers::auth::login))

        // Users, Products, Warehouses, Categories
        .route("/api/v1/users", get(handlers::users::list_users).post(handlers::users::create_user))
        .route("/api/v1/users/:id", put(handlers::users::update_user).delete(handlers::users::delete_user))
        .route("/api/v1/products", get(handlers::products::list_products).post(handlers::products::create_product))
        .route("/api/v1/products/:id", put(handlers::products::update_product).delete(handlers::products::delete_product))
        .route("/api/v1/warehouses", get(handlers::warehouses::list_warehouses).post(handlers::warehouses::create_warehouse))
        .route("/api/v1/warehouses/:id", put(handlers::warehouses::update_warehouse).delete(handlers::warehouses::delete_warehouse))
        .route("/api/v1/categories", get(handlers::categories::list_categories).post(handlers::categories::create_category))
        .route("/api/v1/categories/:id", put(handlers::categories::update_category).delete(handlers::categories::delete_category))

        // Receipts, Deliveries, Transfers, Adjustments
        .route("/api/v1/receipts", get(handlers::receipts::list_receipts).post(handlers::receipts::create_receipt))
        .route("/api/v1/receipts/:id", put(handlers::receipts::update_receipt).delete(handlers::receipts::delete_receipt))
        .route("/api/v1/deliveries", get(handlers::deliveries::list_deliveries).post(handlers::deliveries::create_delivery))
        .route("/api/v1/deliveries/:id", put(handlers::deliveries::update_delivery).delete(handlers::deliveries::delete_delivery))
        .route("/api/v1/transfers", get(handlers::transfers::list_transfers).post(handlers::transfers::create_transfer))
        .route("/api/v1/transfers/:id", put(handlers::transfers::update_transfer).delete(handlers::transfers::delete_transfer))
        .route("/api/v1/adjustments", get(handlers::adjustments::list_adjustments).post(handlers::adjustments::create_adjustment))
        .route("/api/v1/adjustments/:id", put(handlers::adjustments::update_adjustment).delete(handlers::adjustments::delete_adjustment))

        // Stock & Ledger
        .route("/api/v1/stock_ledger", get(handlers::stock_ledger::list_stock_ledger))
        .route("/api/v1/stock/current", get(handlers::stock::current_stock))
        .route("/api/v1/stock/by_product/:product_id", get(handlers::stock::stock_by_product))
        .route("/api/v1/stock/by_warehouse/:warehouse_id", get(handlers::stock::stock_by_warehouse))

        // Dashboard & Move History
        .route("/api/v1/dashboard/summary", get(handlers::dashboard::summary))
        .route("/api/v1/move_history", get(handlers::move_history::list_moves))


        .with_state(pool)
}