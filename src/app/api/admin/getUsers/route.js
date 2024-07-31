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

    // Fetch users with pagination
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        points: true
      },
      orderBy: {
        name: 'asc' // Optional: sort users alphabetically by name
      },
      skip: (page - 1) * limit,
      take: limit
    })

    // Get the total number of users
    const totalUsers = await prisma.user.count()

    // Calculate total number of pages
    const totalPages = Math.ceil(totalUsers / limit)
    const hasNextPage = page < totalPages

    // Check if the current page has no users
    if (users.length === 0 && page > totalPages) {
      return new Response(
        JSON.stringify({
          message: 'No users found',
          users: [],
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

    console.log('Fetched users:', users)

    return new Response(
      JSON.stringify({
        message: 'Users fetched successfully',
        users,
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
    console.error('Error fetching users:', error)

    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 })
  }
}
