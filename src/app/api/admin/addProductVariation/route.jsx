import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req) {
  try {
    const { productId, key, value, salePrice, regularPrice, points } = await req.json()

    // Validate the input data
    if (!productId || !key || !salePrice || !regularPrice || !points) {
      return new Response(JSON.stringify({ message: 'Missing required fields' }), { status: 400 })
    }

    // Create the new product variation
    const newVariation = await prisma.productVariation.create({
      data: {
        productId,
        key,
        value,
        salePrice,
        regularPrice,
        points,
        deletedAt: null
      }
    })

    return new Response(JSON.stringify(newVariation), { status: 201 })
  } catch (error) {
    console.error('Error creating product variation:', error)

    return new Response('Error creating product variation', { status: 500 })
  }
}
