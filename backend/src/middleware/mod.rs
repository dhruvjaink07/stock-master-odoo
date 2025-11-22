// src/middleware/mod.rs
pub mod auth;
pub use auth::{require_auth, AuthUser};