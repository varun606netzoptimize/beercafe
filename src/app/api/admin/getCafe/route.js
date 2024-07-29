import { PrismaClient } from '@prisma/client'

import { verifyAdmin } from '../../utils/verifyAdmin'

const prisma = new PrismaClient()

import { runMiddleware } from '@/lib/cors'

export async function GET(req, res) {
  await runMiddleware(req, res, cors)

  const adminAuthResponse = await verifyAdmin(req)

  if (adminAuthResponse) return adminAuthResponse

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

    if (!cafes || cafes.length === 0) {
      return new Response(JSON.stringify({ message: 'No cafes found' }), { status: 404 })
    }

    console.log('Fetched cafes with managers:', cafes)

    return new Response(JSON.stringify({ message: 'Cafes fetched successfully', cafes }), { status: 200 })
  } catch (error) {
    console.error('Error fetching cafes:', error)

    // Fallback to a general server error if the error is not identified
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 })
  }
}
