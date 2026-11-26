package main

import "fmt"

type Item struct {
	Name      string
	UnitPrice int
	Quantity  int
}

func main() {
	cart := []Item{{Name: "เสื้อ", UnitPrice: 250, Quantity: 2}, {Name: "หมวก", UnitPrice: 150, Quantity: 1}}
	counts := make(map[string]int)
	subtotal := 0
	for _, item := range cart {
		line := item.UnitPrice * item.Quantity
		fmt.Println(item.Name, item.Quantity, "ชิ้น รวม", line)
		counts[item.Name] += item.Quantity
		subtotal += line
	}
	fmt.Println("ยอดสินค้า", subtotal, "จำนวนเสื้อ", counts["เสื้อ"])
}
