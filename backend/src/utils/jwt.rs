// src/utils/jwt.rs
use jsonwebtoken::{decode, encode, Algorithm, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::{Utc, Duration};

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: Uuid,           // user id
    pub exp: usize,          // expiration timestamp
    pub iat: usize,          // issued at
}

pub fn create_jwt(user_id: Uuid) -> crate::error::Result<String> {
    let secret = std::env::var("JWT_SECRET").expect("JWT_SECRET missing");
    let expiration = Utc::now()
        .checked_add_signed(Duration::hours(24))
        .expect("valid timestamp")
        .timestamp() as usize;

    let claims = Claims {
        sub: user_id,
        exp: expiration,
        iat: Utc::now().timestamp() as usize,
    };

    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(secret.as_bytes()),
    )
        .map_err(Into::into)
}

pub fn verify_jwt(token: &str) -> crate::error::Result<Claims> {
    let secret = std::env::var("JWT_SECRET").expect("JWT_SECRET missing");
    let mut validation = Validation::new(Algorithm::HS256);
    validation.validate_exp = true;

    decode::<Claims>(
        token,
        &DecodingKey::from_secret(secret.as_bytes()),
        &validation,
    )
        .map(|data| data.claims)
        .map_err(Into::into)
}