use crate::repository::user_repo;
use crate::dto::user_dto::UserDto;
use crate::dto::auth_dto::{LoginRequest, RegisterRequest};
use crate::config::database::DbPool;
use crate::utils::{jwt, password};
use sqlx::Error;


pub async fn register_user(pool: &DbPool, req: RegisterRequest) -> Result<UserDto, Error> {
    if user_repo::find_by_email(pool, &req.email).await?.is_some() {
        return Err(Error::RowNotFound); // User exists
    }
    let password_hash = password::hash_password(&req.password).map_err(|_| Error::RowNotFound)?;
    let user = user_repo::create_with_password(pool, &req.name, &req.email, &password_hash).await?;
    Ok(user)
}

pub async fn login_user(pool: &DbPool, req: LoginRequest) -> Result<String, Error> {
    let user = user_repo::find_by_email(pool, &req.email).await?.ok_or(Error::RowNotFound)?;
    let valid = password::verify_password(&req.password, &user.password_hash).map_err(|_| Error::RowNotFound)?;
    if !valid {
        return Err(Error::RowNotFound);
    }
    // Use id as Uuid if available, else error
    let user_id = user.id.ok_or(Error::RowNotFound)?;
    let token = jwt::create_jwt(uuid::Uuid::from_u128(user_id as u128)).map_err(|_| Error::RowNotFound)?;
    Ok(token)
}
