package main

import (
	"encoding/json"
	"errors"
	"example.com/go-shop/shop"
	"io"
	"log"
	"net/http"
)

func main() {
	db, err := shop.Open("practice-shop.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()
	mux := http.NewServeMux()
	mux.HandleFunc("GET /orders", func(w http.ResponseWriter, r *http.Request) {
		orders, err := shop.List(r.Context(), db)
		if err != nil {
			http.Error(w, "database error", 500)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(orders)
	})
	mux.HandleFunc("POST /orders", func(w http.ResponseWriter, r *http.Request) {
		var input struct {
			Quantity int `json:"quantity"`
		}
		body, err := io.ReadAll(http.MaxBytesReader(w, r.Body, 4096))
		if err != nil || json.Unmarshal(body, &input) != nil || input.Quantity < 1 || input.Quantity > 100 {
			http.Error(w, "quantity must be 1..100", 400)
			return
		}
		order, err := shop.Place(r.Context(), db, input.Quantity)
		if errors.Is(err, shop.ErrStock) {
			http.Error(w, "insufficient stock", 409)
			return
		}
		if err != nil {
			http.Error(w, "database error", 500)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(201)
		json.NewEncoder(w).Encode(order)
	})
	log.Println("http://127.0.0.1:8080/orders")
	log.Fatal(http.ListenAndServe("127.0.0.1:8080", mux))
}
