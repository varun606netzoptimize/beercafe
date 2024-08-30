import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req, res) {
  try {
    const { customerId, amount, paymentMode, paymentStatus, details } = await req.json()

    if (!customerId || !amount || !paymentMode || !paymentStatus || !details) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 })
    }

    // Create the order
    const order = await prisma.order.create({
      data: {
        customerId,
        amount,
        paymentMode,
        paymentStatus,
        details: {
          create: details.map(detail => ({
            quantity: detail.quantity,
            amount: detail.amount,
            productVariationId: detail.productVariationId,
          })),
        },
      },
      include: {
        details: true,
      },
    })

    return new Response(JSON.stringify(order), { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    
return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 })
  }
}
