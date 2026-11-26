use rusqlite::{Connection, TransactionBehavior, params};
use serde::Serialize;

#[derive(Debug, PartialEq)]
pub enum ShopError {
    Quantity,
    Stock,
    Database,
}

impl From<rusqlite::Error> for ShopError {
    fn from(error: rusqlite::Error) -> Self {
        eprintln!("SQLite: {error}");
        Self::Database
    }
}

#[derive(Debug, Serialize)]
pub struct Order {
    pub id: i64,
    pub quantity: i64,
    pub total: i64,
}

pub fn price(quantity: i64) -> Result<i64, ShopError> {
    if !(1..=100).contains(&quantity) {
        return Err(ShopError::Quantity);
    }
    let subtotal = quantity * 250;
    let shipping = if subtotal >= 1000 { 0 } else { 50 };
    Ok(subtotal + shipping)
}

pub fn initialize(db: &Connection) -> Result<(), ShopError> {
    db.execute_batch("CREATE TABLE IF NOT EXISTS inventory (id INTEGER PRIMARY KEY, stock INTEGER NOT NULL CHECK(stock >= 0));
    INSERT OR IGNORE INTO inventory VALUES (1,5);
    CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY, quantity INTEGER NOT NULL, total INTEGER NOT NULL);")?;
    Ok(())
}

pub fn place(db: &mut Connection, quantity: i64) -> Result<Order, ShopError> {
    let total = price(quantity)?;
    let tx = db.transaction_with_behavior(TransactionBehavior::Immediate)?;
    let changed = tx.execute(
        "UPDATE inventory SET stock = stock - ?1 WHERE id = 1 AND stock >= ?1",
        [quantity],
    )?;
    if changed == 0 {
        return Err(ShopError::Stock);
    }
    tx.execute(
        "INSERT INTO orders (quantity,total) VALUES (?1,?2)",
        params![quantity, total],
    )?;
    let id = tx.last_insert_rowid();
    tx.commit()?;
    Ok(Order {
        id,
        quantity,
        total,
    })
}

pub fn list(db: &Connection) -> Result<Vec<Order>, ShopError> {
    let mut query = db.prepare("SELECT id,quantity,total FROM orders ORDER BY id")?;
    let rows = query.query_map([], |row| {
        Ok(Order {
            id: row.get(0)?,
            quantity: row.get(1)?,
            total: row.get(2)?,
        })
    })?;
    Ok(rows.collect::<Result<Vec<_>, _>>()?)
}
#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn shipping_boundary() {
        assert_eq!(price(3), Ok(800));
        assert_eq!(price(4), Ok(1000));
        assert_eq!(price(0), Err(ShopError::Quantity));
    }
    #[test]
    fn refused_order_preserves_stock() {
        let mut db = Connection::open_in_memory().unwrap();
        initialize(&db).unwrap();
        place(&mut db, 4).unwrap();
        assert_eq!(place(&mut db, 2).unwrap_err(), ShopError::Stock);
        assert_eq!(place(&mut db, 1).unwrap().total, 300);
        assert_eq!(list(&db).unwrap().len(), 2);
    }
}
