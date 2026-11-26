use axum::{Json, Router, extract::State, http::StatusCode, routing::get};
use rusqlite::Connection;
use rust_shop::{Order, ShopError, initialize, list, place};
use serde::Deserialize;

#[derive(Deserialize)]
struct Purchase {
    quantity: i64,
}

type ApiError = (StatusCode, &'static str);
fn response(error: ShopError) -> ApiError {
    match error {
        ShopError::Quantity => (StatusCode::BAD_REQUEST, "quantity must be 1..100"),
        ShopError::Stock => (StatusCode::CONFLICT, "insufficient stock"),
        ShopError::Database => (StatusCode::INTERNAL_SERVER_ERROR, "database unavailable"),
    }
}

async fn database<T: Send + 'static>(
    path: String,
    operation: impl FnOnce(&mut Connection) -> Result<T, ShopError> + Send + 'static,
) -> Result<T, ApiError> {
    tokio::task::spawn_blocking(move || {
        let mut connection = Connection::open(path)?;
        operation(&mut connection)
    })
    .await
    .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, "worker unavailable"))?
    .map_err(response)
}

async fn orders(State(path): State<String>) -> Result<Json<Vec<Order>>, ApiError> {
    database(path, |db| list(db)).await.map(Json)
}

async fn buy(
    State(path): State<String>,
    Json(input): Json<Purchase>,
) -> Result<(StatusCode, Json<Order>), ApiError> {
    let order = database(path, move |db| place(db, input.quantity)).await?;
    Ok((StatusCode::CREATED, Json(order)))
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let path = std::env::var("SHOP_DB").unwrap_or_else(|_| "practice-rust.db".into());
    initialize(&Connection::open(&path)?).map_err(|_| "cannot initialize database")?;
    let app = Router::new()
        .route("/orders", get(orders).post(buy))
        .with_state(path);
    let address = std::env::var("SHOP_ADDR").unwrap_or_else(|_| "127.0.0.1:8081".into());
    let listener = tokio::net::TcpListener::bind(address).await?;
    println!("Rust shop API: http://{}/orders", listener.local_addr()?);
    axum::serve(listener, app).await?;
    Ok(())
}
