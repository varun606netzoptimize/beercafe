import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PUT(req) {
  try {
    const { variationId, key, value, salePrice, regularPrice, points } = await req.json()

    // Validate the input data
    if (!variationId || !key || !salePrice || !regularPrice || !points) {
      return new Response(JSON.stringify({ message: 'Missing required fields' }), { status: 400 })
    }

    // Update the existing product variation
    const updatedVariation = await prisma.productVariation.update({
      where: {
        id: variationId
      },
      data: {
        key,
        value,
        salePrice,
        regularPrice,
        points
      }
    })

    return new Response(JSON.stringify(updatedVariation), { status: 200 })
  } catch (error) {
    console.error('Error updating product variation:', error)

    return new Response('Error updating product variation', { status: 500 })
  }
}
