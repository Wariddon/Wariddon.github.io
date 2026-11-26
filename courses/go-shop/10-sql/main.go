package main

import (
	"context"
	"example.com/go-shop/shop"
	"fmt"
	"log"
)

func main() {
	db, err := shop.Open("practice-shop.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()
	order, err := shop.Place(context.Background(), db, 2)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("เลขออเดอร์", order.ID, "ยอดชำระ", order.Total)
}
