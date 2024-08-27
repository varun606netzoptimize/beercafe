import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req, res) {
  try {
    const body = await req.json()
    const { order_id } = body

    // // Basic validation
    if (!order_id) {
      return new Response(JSON.stringify({ error: 'order id is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const order = await prisma.order.findUnique({
      where: {
        id: order_id
      }
    })

    if (!order) {
      return new Response(JSON.stringify({ error: 'Bad Request!', order }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify(order), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error(error)

    return new Response(JSON.stringify({ error: 'Server Error!' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  } finally {
    await prisma.$disconnect()
  }
}
