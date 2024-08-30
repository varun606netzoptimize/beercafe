import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req) {
  const url = new URL(req.url)
  const cafeId = url.searchParams.get('cafeId')
  const slug = url.searchParams.get('slug')

  if (!cafeId && !slug) {
    return new Response('Cafe ID or slug is required', { status: 400 })
  }

  try {
    let cafe;

    if (slug) {
      // Fetch the cafe by slug
      cafe = await prisma.cafe.findUnique({
        where: { slug: slug }
      });

      if (!cafe) {
        return new Response('Cafe not found', { status: 404 })
      }
    } else {
      cafe = await prisma.cafe.findUnique({
        where: { id: cafeId }
      });

      if (!cafe) {
        return new Response('Cafe not found', { status: 404 })
      }
    }

    // Fetch products for the specified cafeId
    const products = await prisma.product.findMany({
      where: {
        cafeId: cafe.id
      },
      include: {
        Brand: true,
        variations: true
      }
    })

    return new Response(JSON.stringify(products), { status: 200 })
  } catch (error) {
    console.error('Error fetching products:', error.message)

    return new Response('Error fetching products', { status: 500 })
  }
}
