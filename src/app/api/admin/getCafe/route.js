import { PrismaClient } from '@prisma/client'

import { verifyAdmin } from '../../utils/verifyAdmin'

const prisma = new PrismaClient()

export async function GET(req, res) {
  const adminAuthResponse = await verifyAdmin(req)

  if (adminAuthResponse) return adminAuthResponse

  try {
    // Extract pagination parameters from query, default to page 1 and limit 10
    const url = new URL(req.url, `http://${req.headers.host}`)
    const page = parseInt(url.searchParams.get('page')) || 1
    const limit = parseInt(url.searchParams.get('limit')) || 10

    // Fetch cafes with pagination and sorting
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
      },
      orderBy: {
        name: 'asc'
      },
      skip: (page - 1) * limit,
      take: limit
    })

    // Get the total number of cafes
    const totalCafes = await prisma.cafe.count()

    // Calculate total number of pages
    const totalPages = Math.ceil(totalCafes / limit)
    const hasNextPage = page < totalPages

    // Check if the current page has no cafes
    if (cafes.length === 0 && page > totalPages) {
      return new Response(
        JSON.stringify({
          message: 'No cafes found',
          cafes: [],
          pagination: {
            page,
            limit,
            totalPages,
            hasNextPage: false
          }
        }),
        { status: 200 }
      )
    }

    console.log('Fetched cafes with managers:', cafes)

    return new Response(
      JSON.stringify({
        message: 'Cafes fetched successfully',
        cafes,
        pagination: {
          page,
          limit,
          totalPages,
          hasNextPage
        }
      }),
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching cafes:', error)

    // Fallback to a general server error if the error is not identified
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 })
  }
}
