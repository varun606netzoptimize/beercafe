import { PrismaClient } from '@prisma/client'

import { verifyAdmin } from '../../utils/verifyAdmin'

const prisma = new PrismaClient()

import cors, { runMiddleware } from '@/lib/cors'

export async function GET(req, res) {
  await runMiddleware(req, res, cors)

  // Verify admin credentials
  const adminAuthResponse = await verifyAdmin(req)

  if (adminAuthResponse) return adminAuthResponse

  try {
    // Fetch all cafes with their creation date
    const cafes = await prisma.cafe.findMany({
      select: {
        id: true,
        name: true,
        location: true,
        createdAt: true
      }
    })

    // Organize cafes by month
    const monthlyData = {}

    cafes.forEach(cafe => {
      const month = cafe.createdAt.toISOString().slice(0, 7) // YYYY-MM format

      if (!monthlyData[month]) {
        monthlyData[month] = []
      }

      monthlyData[month].push({
        id: cafe.id,
        name: cafe.name,
        location: cafe.location,
        createdAt: cafe.createdAt
      })
    })

    // Convert monthlyData to an array of objects for better readability
    const stats = Object.keys(monthlyData).map(month => ({
      month,
      cafes: monthlyData[month]
    }))

    console.log('Monthly stats with cafes:', stats)

    return new Response(JSON.stringify({ message: 'Stats fetched successfully', stats }), { status: 200 })
  } catch (error) {
    console.error('Error fetching stats:', error)

    return new Response(JSON.stringify({ message: 'Error fetching stats' }), { status: 500 })
  }
}
