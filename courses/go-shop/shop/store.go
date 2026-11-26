package shop

import (
	"context"
	"database/sql"
	"errors"
	_ "modernc.org/sqlite"
)

var ErrStock = errors.New("insufficient stock")

type Order struct {
	ID       int64 `json:"id"`
	Quantity int   `json:"quantity"`
	Total    int   `json:"total"`
}

func Open(path string) (*sql.DB, error) {
	db, err := sql.Open("sqlite", path)
	if err != nil {
		return nil, err
	}
	db.SetMaxOpenConns(1)
	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS products(id INTEGER PRIMARY KEY,stock INTEGER NOT NULL CHECK(stock>=0));
 INSERT OR IGNORE INTO products VALUES(1,5);
 CREATE TABLE IF NOT EXISTS orders(id INTEGER PRIMARY KEY, quantity INTEGER NOT NULL,total INTEGER NOT NULL);`)
	if err != nil {
		db.Close()
		return nil, err
	}
	return db, nil
}
func Place(ctx context.Context, db *sql.DB, qty int) (Order, error) {
	var o Order
	if qty < 1 || qty > 100 {
		return o, errors.New("invalid quantity")
	}
	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		return o, err
	}
	defer tx.Rollback()
	result, err := tx.ExecContext(ctx, "UPDATE products SET stock=stock-? WHERE id=1 AND stock>=?", qty, qty)
	if err != nil {
		return o, err
	}
	rows, err := result.RowsAffected()
	if err != nil {
		return o, err
	}
	if rows == 0 {
		return o, ErrStock
	}
	total := qty * 250
	if total < 1000 {
		total += 50
	}
	result, err = tx.ExecContext(ctx, "INSERT INTO orders(quantity,total) VALUES(?,?)", qty, total)
	if err != nil {
		return o, err
	}
	id, err := result.LastInsertId()
	if err != nil {
		return o, err
	}
	if err = tx.Commit(); err != nil {
		return o, err
	}
	return Order{id, qty, total}, nil
}
func List(ctx context.Context, db *sql.DB) ([]Order, error) {
	rows, err := db.QueryContext(ctx, "SELECT id,quantity,total FROM orders ORDER BY id")
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	orders := []Order{}
	for rows.Next() {
		var o Order
		if err := rows.Scan(&o.ID, &o.Quantity, &o.Total); err != nil {
			return nil, err
		}
		orders = append(orders, o)
	}
	return orders, rows.Err()
}
