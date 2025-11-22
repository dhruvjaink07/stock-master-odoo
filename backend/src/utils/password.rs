// src/utils/password.rs
use bcrypt::{hash, verify, DEFAULT_COST};

pub fn hash_password(password: &str) -> crate::error::Result<String> {
    hash(password, DEFAULT_COST).map_err(Into::into)
}

pub fn verify_password(password: &str, hash: &str) -> crate::error::Result<bool> {
    verify(password, hash).map_err(Into::into)
}