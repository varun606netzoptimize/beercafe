import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req) {
  try {
    // Fetch all cafes along with their managers
    const cafes = await prisma.cafe.findMany({
      include: {
        managers: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    })

    console.log('Fetched cafes with managers:', cafes)

    return new Response(JSON.stringify({ message: 'Cafes fetched successfully', cafes }), { status: 200 })
  } catch (error) {
    console.error('Error fetching cafes:', error)

    return new Response(JSON.stringify({ message: 'Error fetching cafes' }), { status: 500 })
  }
}
