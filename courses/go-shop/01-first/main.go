package main

import "fmt"

func main() {
	name := "เสื้อ"
	price := 250
	quantity := 2
	fmt.Printf("%s จำนวน %d ตัว รวม %d บาท\n", name, quantity, price*quantity)
}
