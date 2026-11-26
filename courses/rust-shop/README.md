# ร้านเสื้อด้วย Next.js และ Rust

[อ่านคอร์สภาษาไทยใน Workspace](https://wariddon.github.io/workspace.html?shelf=15#rust-start)

เบราว์เซอร์ → Next.js บนพอร์ต 3001 → Rust API บนพอร์ต 8081 → SQLite ในไฟล์ practice-rust.db

เปิด PowerShell ในโฟลเดอร์ courses/rust-shop ภายใน repo ถ้ายังไม่มี repo ให้เริ่มด้วย

```powershell
git clone https://github.com/Wariddon/Wariddon.github.io.git
cd Wariddon.github.io/courses/rust-shop
```

ใช้ Rust stable และ Node.js 24 เรียนบท 1–7 ในเทอร์มินัลเดียวได้ ตั้งแต่บท 8 ให้เปิด API ค้างไว้และใช้เทอร์มินัลที่สองสำหรับ Next.js ตัวอย่างร้านค้ารันบนเครื่องของผู้เรียน

## บทที่ 1 · เตรียมเครื่องและรันโปรแกรมแรก

Cargo ใช้จัดการแพ็กเกจ คอมไพล์ และรันตัวอย่างในโฟลเดอร์ examples เริ่มจาก repo résumé ของคุณ เปิด PowerShell ใน courses/rust-shop ทุกคำสั่งในคอร์สเริ่มจากโฟลเดอร์นี้ ใช้ Rust stable ผ่าน rustup และ Node.js 24 สำหรับบท Next.js บน Windows เลือก MSVC พร้อม C++ Build Tools และ Windows SDK หาก linker ขาด

```powershell
rustc --version
cargo --version
cargo run --example first
```

**ลองทำ** เปิด examples/first.rs แล้วเปลี่ยนชื่อเสื้อเป็นชื่อสินค้าที่คุณเลือก รันอีกครั้ง

**ตรวจคำตอบ** เห็นชื่อใหม่และยอด 500 บาท

[เปิด examples/first.rs](examples/first.rs)

## บทที่ 2 · คิดราคาด้วยตัวแปรและนิพจน์

let ผูกชื่อกับค่า ค่าเริ่มต้นแก้ซ้ำไม่ได้ ตัวอย่างระบุ i64 ให้ราคาจำนวนเงินบาทเต็ม ส่วน quantity อนุมานชนิดตามการคูณ println! เติมค่าลงในวงเล็บปีกกา ลองคำนวณบนกระดาษก่อนรัน

```rust
let price: i64 = 250;
let quantity = 2;
println!("{} บาท", price * quantity);
```

**ลองทำ** แก้ quantity เป็น 3 แล้วเพิ่มตัวแปร shipping = 50 และรวมค่าส่งในผลลัพธ์

**ตรวจคำตอบ** 3 × 250 + 50 ได้ 800 บาท

[เปิด examples/first.rs](examples/first.rs)

## บทที่ 3 · ยืมตะกร้าด้วย reference

Vec เป็นเจ้าของรายการสินค้าแต่ละตัว และ Item เป็นเจ้าของชื่อชนิด String เมื่อส่ง &cart ฟังก์ชันยืมข้อมูลไปอ่าน &[Item] คือ slice ที่มองเห็นรายการโดยไม่รับ ownership กลับจาก subtotal แล้ว main ยังอ่านจำนวนรายการใน cart ได้

```powershell
cargo run --example cart
```

**ลองทำ** ลองเพิ่ม let moved = cart; ก่อนบรรทัด cart.len() อ่าน error เรื่อง moved value แล้วเปลี่ยนเป็น let moved = &cart; และใช้ moved.len()

**ตรวจคำตอบ** แบบแรกคอมไพล์ไม่ผ่าน แบบยืมอ่านได้ 2 รายการ

[เปิด examples/cart.rs](examples/cart.rs)

## บทที่ 4 · ออกแบบสินค้าและวนรวมยอด

struct กำหนดช่อง name, price และ quantity ให้ชนิดเดียวกันทั้งตะกร้า Vec โตได้ด้วย push เมื่อประกาศ let mut cart ใน subtotal เราใช้ for อ่านแต่ละ Item และบวกสะสมลงใน sum ที่แก้ค่าได้

```powershell
cargo run --example cart
```

**ลองทำ** เพิ่มสินค้า ถุงเท้า ราคา 120 จำนวน 3 ใน cart ก่อนเรียก subtotal

**ตรวจคำตอบ** ยอดสินค้าเปลี่ยนจาก 650 เป็น 1010 บาท และมี 3 รายการ

[เปิด examples/cart.rs](examples/cart.rs)

## บทที่ 5 · อ่านจำนวนและจัดการ Option กับ Result

args().nth(1) คืน Option เพราะผู้ใช้อาจไม่ส่งจำนวนมา ส่วน parse คืน Result เพราะข้อความอาจแปลงเป็นตัวเลขไม่ได้ ใช้ match แยกกรณีเหล่านี้ออกจากกติกาของร้าน ฟังก์ชัน price คืน Result ของยอดหรือ ShopError เครื่องหมาย ? ที่ใช้ในบทฐานข้อมูลจะส่งข้อผิดพลาดกลับผู้เรียกทันที

```powershell
cargo run --example checkout -- 4
cargo run --example checkout -- abc
cargo run --example checkout -- 0
```

**ลองทำ** ลองรันโดยไม่มีค่าหลัง checkout แล้วลองจำนวน 3 กับ 4 เพื่อดูขอบส่งฟรี

**ตรวจคำตอบ** ไม่มีค่าจะเห็นวิธีป้อน abc ขอจำนวนเต็ม 0 ผิดช่วง ส่วน 3 กับ 4 ได้ 800 และ 1000 บาท

[เปิด examples/checkout.rs](examples/checkout.rs)

## บทที่ 6 · เขียน unit test ให้กติกาส่งฟรี

#[test] เปลี่ยนฟังก์ชันเป็นกรณีทดสอบ assert_eq! เปรียบเทียบผลจริงกับผลที่คาด เริ่มจากขอบที่เสื้อ 4 ตัวพอดีครบ 1000 บาท ธุรกิจให้ Rust คำนวณค่าส่งจากจำนวนสินค้า จุดเดียวกันนี้ถูกเรียกจาก API

```powershell
cargo test shipping_boundary
```

**ลองทำ** ลองเปลี่ยน >= 1000 เป็น > 1000 ใน price รัน test อ่านค่าที่คลาด แล้วคืนกติกาเดิม

**ตรวจคำตอบ** เมื่อผิดจะได้ 1050 แทน 1000 เมื่อแก้กลับ test ผ่าน

[เปิด src/lib.rs](src/lib.rs)

## บทที่ 7 · ตัดสต็อกและบันทึกออเดอร์ใน SQLite

ฐานทดลองมีเสื้อ 5 ตัว place เริ่ม transaction ก่อน UPDATE โดยมีเงื่อนไข stock >= จำนวนที่ซื้อ ถ้าไม่มีแถวเปลี่ยน คืน ShopError::Stock หากมีจึง INSERT ออเดอร์แล้ว commit การคืนก่อน commit จะปล่อย transaction และย้อนการเปลี่ยนแปลง ตัวทดสอบใช้ฐานในหน่วยความจำเพื่อเริ่มใหม่เท่ากันทุกครั้ง

```powershell
cargo test refused_order_preserves_stock
```

**ลองทำ** ไล่สต็อกตามลำดับซื้อ 4, 2 และ 1 ตัว สังเกตว่าเหตุใดออเดอร์สุดท้ายยังสำเร็จ

**ตรวจคำตอบ** สต็อก 5 → 1 → 1 → 0 เหลือออเดอร์ที่สำเร็จ 2 รายการ

[เปิด src/lib.rs](src/lib.rs)

## บทที่ 8 · เปิด Rust HTTP API ด้วย Axum

Router จับ GET /orders ไปที่ orders และ POST ไปที่ buy ตัวรับ Json<Purchase> ให้ Serde แปลง JSON เป็น struct ก่อนเรียกกติกาของร้าน State ส่ง path ฐานข้อมูลให้ handler ส่วน spawn_blocking ให้ SQLite ทำงานบนเธรดสำหรับงานที่อาจต้องรอ เปิด API ค้างไว้และใช้ PowerShell อีกหน้าทดสอบ

```powershell
cargo run --bin rust-shop
```

**ลองทำ** ในเทอร์มินัลใหม่ เรียก Invoke-RestMethod http://127.0.0.1:8081/orders แล้วลองส่ง POST ด้วยคำสั่งในบทถัดไป

**ตรวจคำตอบ** ฐานใหม่ให้รายการว่าง หลังสร้างจะเห็น id, quantity และ total

[เปิด src/main.rs](src/main.rs)

## บทที่ 9 · ทดลองสัญญาระหว่าง Next.js กับ Rust

หน้าเว็บส่งเพียง quantity ไปที่ API Rust ตรวจจำนวน คำนวณราคา แล้วส่ง JSON ของออเดอร์เมื่อบันทึกสำเร็จ สถานะ 201 คือสร้างสำเร็จ 400 คือจำนวนอยู่นอกช่วง และ 409 คือสต็อกไม่พอ พิจารณาสถานะก่อนนำ JSON ไปแสดง

```powershell
$url = 'http://127.0.0.1:8081/orders'
Invoke-RestMethod $url -Method Post -ContentType application/json -Body '{"quantity":1}'
Invoke-RestMethod $url
```

**ลองทำ** ซื้อ 1 ตัวกับฐานใหม่ แล้วเปลี่ยน quantity เป็น 100 และ 0

**ตรวจคำตอบ** ครั้งแรกได้ total 300 อีกสองครั้งได้ 409 และ 400 จำนวนออเดอร์ไม่เพิ่ม

[เปิด src/main.rs](src/main.rs)

## บทที่ 10 · สร้างหน้าร้านด้วย Next.js App Router

เปิด Rust API ค้างไว้ แล้วเปิดอีกเทอร์มินัลที่ courses/rust-shop Page เป็น Server Component ที่ดึง GET /orders และใช้ map สร้างบรรทัดสำหรับแต่ละออเดอร์ ใช้ id เป็น key เพื่อให้ React จับคู่ข้อมูลกับแถวเดิมได้ เปิด http://127.0.0.1:3001 หลัง dev server พร้อม

```powershell
cd web
npm ci
npm run dev
```

**ลองทำ** อ่าน page.jsx หา fetch สำหรับ GET และ key สำหรับแต่ละรายการ ลองหยุด Rust API แล้วรีเฟรชหน้าเว็บ จากนั้นเปิด Rust ใหม่

**ตรวจคำตอบ** ตอน API หยุดจะเห็นคำแนะนำและปุ่มซื้อใช้ไม่ได้ เมื่อ API กลับมาให้รีเฟรชเพื่อเห็นรายการอีกครั้ง

[เปิด web/app/page.jsx](web/app/page.jsx)

## บทที่ 11 · ตามออเดอร์จากฟอร์มถึงฐานข้อมูล

เมื่อกดสั่งซื้อ ฟอร์มเรียก Server Action ชื่อ purchase บน Next.js ซึ่งอ่าน FormData และส่ง JSON ไปที่ Rust เมื่อ API ตอบกลับ Next.js เลือกข้อความตามสถานะแล้ว redirect กลับหน้าร้าน การอ่านรายการใช้ cache: 'no-store' จึงเห็นออเดอร์จากฐานข้อมูลหลัง redirect

```jsx
<form action={purchase}>
  <input name="quantity" type="number" min="1" max="100" required />
  <button>สั่งซื้อ</button>
</form>
```

**ลองทำ** บนฐานที่ยังมีสต็อก สั่ง 1 ตัวในเว็บ จดเลขออเดอร์ แล้วลองสั่ง 100 ตัว

**ตรวจคำตอบ** ครั้งแรกเห็นเลขออเดอร์และยอด 300 บาท ครั้งหลังหน้าเดิมแจ้งสินค้าไม่พอและไม่มีเลขใหม่

[เปิด web/app/page.jsx](web/app/page.jsx)

## บทที่ 12 · Build และตรวจการทำงานทั้งระบบ

สร้าง Rust release binary และ Next.js production build แยกกัน บน Windows เปิด API ด้วยไฟล์ exe จากโฟลเดอร์เดิมเพื่อใช้ฐานเดิม แล้วรัน Next ในเทอร์มินัลที่สอง ถ้าต้องการฐานฝึกใหม่ให้ตั้ง SHOP_DB เป็นชื่อไฟล์ใหม่ก่อนเปิด API

```powershell
cargo test --locked
cargo build --release --locked
.\target\release\rust-shop.exe
```

**ลองทำ** อีกเทอร์มินัลรัน cd web แล้ว npm ci, npm run build และ npm start บนฐานใหม่สั่ง 4 ตัวผ่านหน้าเว็บ ตามด้วย 2 ตัว ปิดแล้วเปิด API ใหม่และรีเฟรช

**ตรวจคำตอบ** ครั้งแรกจ่าย 1000 บาท ครั้งที่สองสต็อกไม่พอ เปิดใหม่ยังพบออเดอร์แรก

[เปิด Cargo.toml](Cargo.toml)
