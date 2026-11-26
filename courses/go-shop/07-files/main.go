package main

import (
	"encoding/json"
	"fmt"
	"os"
)

type Order struct {
	Product  string
	Quantity int
}

func run() error {
	const path = "practice-order.json"
	if len(os.Args) > 1 && os.Args[1] == "read" {
		b, err := os.ReadFile(path)
		if err != nil {
			return err
		}
		var order Order
		if err = json.Unmarshal(b, &order); err != nil {
			return err
		}
		fmt.Println(order.Product, order.Quantity)
		return nil
	}
	b, err := json.Marshal(Order{"เสื้อ", 2})
	if err != nil {
		return err
	}
	return os.WriteFile(path, b, 0600)
}
func main() {
	if err := run(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
