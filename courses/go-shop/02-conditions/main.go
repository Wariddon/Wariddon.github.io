package main

import "fmt"

func main() {
	subtotal := 250 * 3
	shipping := 40
	if subtotal >= 750 {
		shipping = 0
	}
	fmt.Println("ยอดชำระ", subtotal+shipping)
}
