use crate::dto::user_dto::{UserDto, CreateUserRequest, UpdateUserRequest};
use crate::config::database::DbPool;
use sqlx::Error;
use argon2::{Argon2, PasswordHasher};
use password_hash::{SaltString, PasswordHash, rand_core::OsRng};

pub async fn get_all(pool: &DbPool) -> Result<Vec<UserDto>, Error> {
    let users = sqlx::query_as!(UserDto,
        r#"SELECT id, name, email, is_admin, created_at, updated_at FROM users ORDER BY id"#
    )
    .fetch_all(pool)
    .await?;
    Ok(users)
}

pub async fn create(pool: &DbPool, req: CreateUserRequest) -> Result<UserDto, Error> {
    let password_hash = hash_password(&req.password);
    let rec = sqlx::query_as!(UserDto,
        r#"INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)
        RETURNING id, name, email, is_admin, created_at, updated_at"#,
        req.name, req.email, password_hash
    )
    .fetch_one(pool)
    .await?;
    Ok(rec)
}

pub async fn update(pool: &DbPool, id: i32, req: UpdateUserRequest) -> Result<UserDto, Error> {
    let password_hash = req.password.as_ref().map(|p| hash_password(p));
    let rec = sqlx::query_as!(UserDto,
        r#"UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email), password_hash = COALESCE($3, password_hash), updated_at = NOW()
        WHERE id = $4 RETURNING id, name, email, is_admin, created_at, updated_at"#,
        req.name, req.email, password_hash, id
    )
    .fetch_one(pool)
    .await?;
    Ok(rec)
}

pub async fn delete(pool: &DbPool, id: i32) -> Result<(), Error> {
    sqlx::query!("DELETE FROM users WHERE id = $1", id)
        .execute(pool)
        .await?;
    Ok(())
}

fn hash_password(password: &str) -> String {
    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();
    let password_hash = argon2.hash_password(password.as_bytes(), &salt).unwrap().to_string();
    password_hash
}
