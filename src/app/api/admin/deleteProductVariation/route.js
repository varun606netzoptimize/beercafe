import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function DELETE(req) {
  try {
    const { variationId } = await req.json()

    if (!variationId) {
      return new Response(JSON.stringify({ message: 'Missing required variation ID' }), { status: 400 })
    }

    const existingVariation = await prisma.productVariation.findUnique({
      where: { id: variationId }
    })

    if (!existingVariation) {
      return new Response(JSON.stringify({ message: 'Product variation not found' }), { status: 404 })
    }

    // Perform a "soft delete" by setting the 'deletedAt' timestamp
    await prisma.productVariation.update({
      where: { id: variationId },
      data: { deletedAt: new Date() }
    })

    return new Response(JSON.stringify({ message: 'Product variation soft deleted successfully' }), { status: 200 })
  } catch (error) {
    console.error('Error soft deleting product variation:', error)

return new Response('Error soft deleting product variation', { status: 500 })
  }
}
