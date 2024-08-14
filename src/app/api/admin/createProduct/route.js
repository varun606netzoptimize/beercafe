import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req) {
  try {
    const { brandId, cafeId, name, SKU, description, quantity, image } = await req.json()

    // Validate input
    if (!brandId || !cafeId || !name || !SKU || !quantity) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 })
    }

    const newProduct = await prisma.product.create({
      data: {
        brandId,
        cafeId,
        name,
        SKU,
        description,
        quantity,
        image
      }
    })

    return new Response(JSON.stringify(newProduct), { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)

    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 })
  }
}
