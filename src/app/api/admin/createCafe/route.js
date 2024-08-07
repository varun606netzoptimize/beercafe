import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req, res) {
  try {
    const body = await req.json()
    const { name, location, address, description, parentId, priceConversionRate } = body

    // Basic validation
    if (!name || !location || !address) {
      return new Response(JSON.stringify({ error: 'Name, location, and address are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const newCafe = await prisma.cafe.create({
      data: {
        name,
        location,
        address,
        description,
        parentId,
        priceConversionRate
      }
    })

    return new Response(JSON.stringify(newCafe), { status: 201, headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error(error)

    return new Response(JSON.stringify({ error: 'An error occurred while creating the cafe' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  } finally {
    await prisma.$disconnect()
  }
}
