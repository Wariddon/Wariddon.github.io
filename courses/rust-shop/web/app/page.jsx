import { redirect } from 'next/navigation'

const endpoint = process.env.SHOP_API_URL || 'http://127.0.0.1:8081/orders'
const messages = {
  ok: 'บันทึกออเดอร์แล้ว',
  stock: 'สินค้าไม่พอ กรุณาลดจำนวน',
  invalid: 'กรุณากรอกจำนวนเต็ม 1 ถึง 100',
  offline: 'เชื่อมต่อ Rust API ไม่สำเร็จ'
}

async function purchase(form) {
  'use server'
  const quantity = Number(form.get('quantity'))
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) redirect('/?result=invalid')
  let result
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity })
    })
    result = response.ok ? 'ok' : response.status === 409 ? 'stock' : response.status === 400 ? 'invalid' : 'offline'
  } catch {
    result = 'offline'
  }
  redirect('/?result=' + result)
}

export default async function Page({ searchParams }) {
  const { result } = await searchParams
  let orders = null
  try {
    const response = await fetch(endpoint, { cache: 'no-store' })
    if (response.ok) orders = await response.json()
  } catch {
    // Keep the storefront readable while the local API starts.
  }

  return <main>
    <h1>ร้านเสื้อ</h1>
    <section><h2>เสื้อยืด</h2><p className="price">250 บาท <small>/ ตัว</small></p>
      <p>ค่าส่ง 50 บาท · ส่งฟรีเมื่อยอดสินค้าถึง 1,000 บาท</p>
      <form action={purchase}><label>จำนวนตัว<input name="quantity" type="number" min="1" max="100" defaultValue="1" required /></label>
        <button disabled={!orders}>สั่งซื้อ</button></form>
      <p role="status">{orders === null ? messages.offline : messages[result]}</p>
    </section>
    <section><h2>ออเดอร์</h2>{orders === null ? <p>เปิด Rust API แล้วรีเฟรชหน้านี้</p> : orders.length === 0 ? <p>ยังไม่มีออเดอร์</p> :
      <ul>{orders.map(order => <li key={order.id}><span>#{order.id} · เสื้อ {order.quantity} ตัว</span><strong>{order.total} บาท</strong></li>)}</ul>}
    </section>
  </main>
}
