import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
const endpoint = 'http://127.0.0.1:8080/orders'

async function buy(form) {
  'use server'
  const quantity = Number(form.get('quantity'))
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity })
  })
  if (!response.ok) redirect('/?result=' + (response.status === 409 ? 'stock' : 'error'))
  revalidatePath('/')
  redirect('/?result=ok')
}

export default async function Page({ searchParams }) {
  const response = await fetch(endpoint, { cache: 'no-store' })
  if (!response.ok) throw new Error('อ่านออเดอร์ไม่ได้')
  const orders = await response.json()
  const { result } = await searchParams
  const messages = { stock: 'สินค้าไม่พอ', error: 'สร้างออเดอร์ไม่ได้', ok: 'บันทึกออเดอร์แล้ว' }
  return <main><h1>ร้านเสื้อฝึก Go</h1>
    <form action={buy}><label>เสื้อ 250 บาท จำนวน <input name="quantity" type="number" min="1" max="100" defaultValue="1" required /></label> <button>สั่งซื้อ</button></form>
    <p role="status">{messages[result]}</p>
    <h2>ออเดอร์</h2>{orders.length === 0 ? <p>ยังไม่มีออเดอร์</p> :
      <ul>{orders.map(o => <li key={o.id}>#{o.id} จำนวน {o.quantity} ตัว ยอดชำระ {o.total} บาท</li>)}</ul>}
  </main>
}
