import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req) {
  try {
    // Fetch products with brand and variations
    const products = await prisma.product.findMany({
      include: {
        Brand: true,
        variations: true
      }
    })

    // Optionally fetch cafes if needed
    const cafeIds = products.map(product => product.cafeId).filter(id => id)

    const cafes = await prisma.cafe.findMany({
      where: { id: { in: cafeIds } }
    })

    // Optionally merge cafe data back into products
    const productsWithCafes = products.map(product => ({
      ...product,
      cafe: cafes.find(cafe => cafe.id === product.cafeId) || null
    }))

    return new Response(JSON.stringify(productsWithCafes), { status: 200 })
  } catch (error) {
    console.error('Error fetching products:', error)

    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 })
  }
}
