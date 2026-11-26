struct Item {
    name: String,
    price: i64,
    quantity: i64,
}
fn subtotal(cart: &[Item]) -> i64 {
    let mut sum = 0;
    for item in cart {
        println!("{} × {}", item.name, item.quantity);
        sum += item.price * item.quantity;
    }
    sum
}
fn main() {
    let mut cart = vec![Item {
        name: String::from("เสื้อ"),
        price: 250,
        quantity: 2,
    }];
    cart.push(Item {
        name: String::from("หมวก"),
        price: 150,
        quantity: 1,
    });
    println!("รวม {} บาท", subtotal(&cart));
    println!("มี {} รายการ", cart.len());
}
