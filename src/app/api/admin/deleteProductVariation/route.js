import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function DELETE(req) {
  try {
    const { variationId } = await req.json()

    // Validate input: 'variationId' is required to delete a product variation
    if (!variationId) {
      return new Response(JSON.stringify({ message: 'Missing required variation ID' }), { status: 400 })
    }

    // Find the existing product variation by ID
    const existingVariation = await prisma.productVariation.findUnique({
      where: { id: variationId }
    })

    if (!existingVariation) {
      return new Response(JSON.stringify({ message: 'Product variation not found' }), { status: 404 })
    }

    // Delete the product variation from the database
    await prisma.productVariation.delete({
      where: { id: variationId }
    })

    return new Response(JSON.stringify({ message: 'Product variation deleted successfully' }), { status: 200 })
  } catch (error) {
    console.error('Error deleting product variation:', error)

    return new Response('Error deleting product variation', { status: 500 })
  }
}
