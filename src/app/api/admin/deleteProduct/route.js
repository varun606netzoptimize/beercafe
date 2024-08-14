import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function DELETE(req) {
  try {
    const { id } = await req.json()

    // Validate input
    if (!id) {
      return new Response(JSON.stringify({ error: 'Product ID is required' }), { status: 400 })
    }

    // Check if the product exists
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        variations: {
          include: {
            OrderDetail: true
          }
        }
      }
    })

    if (!product) {
      return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 })
    }

    // Delete related OrderDetail records
    for (const variation of product.variations) {
      await prisma.orderDetail.deleteMany({
        where: { productVariationId: variation.id }
      })
    }

    // Delete related ProductVariation records
    await prisma.productVariation.deleteMany({
      where: { productId: id }
    })

    // Delete the product
    await prisma.product.delete({
      where: { id }
    })

    return new Response(JSON.stringify({ message: 'Product deleted successfully' }), { status: 200 })
  } catch (error) {
    console.error('Error deleting product:', error)

    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 })
  }
}
