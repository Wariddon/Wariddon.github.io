use rust_shop::{ShopError, price};
fn main() {
    let argument = std::env::args().nth(1);
    let quantity = match argument {
        Some(text) => match text.parse::<i64>() {
            Ok(value) => value,
            Err(_) => {
                println!("กรอกจำนวนเต็ม");
                return;
            }
        },
        None => {
            println!("เพิ่มจำนวนหลัง -- เช่น -- 4");
            return;
        }
    };
    match price(quantity) {
        Ok(total) => println!("ยอดชำระ {total} บาท"),
        Err(ShopError::Quantity) => println!("กรอกจำนวน 1 ถึง 100"),
        Err(error) => println!("เกิดข้อผิดพลาด {error:?}"),
    }
}
