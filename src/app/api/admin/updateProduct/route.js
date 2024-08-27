import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PUT(req) {
  try {
    const { id, brandId, cafeId, name, SKU, description, quantity, image } = await req.json()

    // Validate input: 'id', 'brandId', 'name', 'SKU', and 'quantity' are required
    if (!id || !brandId || !name || !SKU || !quantity) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 })
    }

    // Find the existing product by ID
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    })

    if (!existingProduct) {
      return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 })
    }

    // Update the product in the database
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        brandId,
        name,
        SKU,
        quantity,
        description: description || null,
        image: image || null,
        cafeId: cafeId || null // Only include cafeId if provided
      }
    })

    return new Response(JSON.stringify(updatedProduct), { status: 200 })
  } catch (error) {
    console.error('Error updating product:', error)

    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 })
  }
}
