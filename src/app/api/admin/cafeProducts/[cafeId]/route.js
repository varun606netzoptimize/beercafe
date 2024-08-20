import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req, { params }) {
  const { cafeId } = params

  try {
    // Fetch products for the specified cafe, including variations and their prices
    const products = await prisma.product.findMany({
      where: {
        cafeId: cafeId
      },
      include: {
        Brand: true,
        variations: true
      }
    })

    return new Response(JSON.stringify(products), { status: 200 })
  } catch (error) {
    console.error('Error fetching products:', error)

    return new Response('Error fetching products', { status: 500 })
  }
}
