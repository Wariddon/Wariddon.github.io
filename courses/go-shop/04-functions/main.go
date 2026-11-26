package main

import "fmt"

func shippingFee(subtotal int) int {
	if subtotal == 0 || subtotal >= 1000 {
		return 0
	}
	return 50
}
func main() {
	for _, subtotal := range []int{0, 999, 1000} {
		fmt.Println(subtotal, shippingFee(subtotal))
	}
}
