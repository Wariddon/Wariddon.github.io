package main

import "fmt"

func main() {
	var quantity int
	fmt.Println("ซื้อเสื้อกี่ตัว?")
	if _, err := fmt.Scan(&quantity); err != nil {
		fmt.Println("กรุณากรอกจำนวนเต็ม")
		return
	}
	if quantity < 1 || quantity > 100 {
		fmt.Println("รับครั้งละ 1 ถึง 100 ตัว")
		return
	}
	fmt.Println("ยอดสินค้า", 250*quantity)
}
