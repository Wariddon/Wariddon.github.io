package main

import "fmt"

func main() {
	lines := []int{250 * 2, 150}
	subtotal := 0
	for _, amount := range lines {
		subtotal += amount
		fmt.Println("ยอดสะสม", subtotal)
	}
	shipping := 50
	if subtotal >= 1000 {
		shipping = 0
	}
	fmt.Println("ยอดชำระ", subtotal+shipping)
}
