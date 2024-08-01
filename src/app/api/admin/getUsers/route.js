import { PrismaClient } from '@prisma/client'

import { verifyAdmin } from '../../utils/verifyAdmin'

const prisma = new PrismaClient()

export async function GET(req, res) {
  const adminAuthResponse = await verifyAdmin(req)

  if (adminAuthResponse) return adminAuthResponse

  try {
    // Extract pagination and sorting parameters from query
    const url = new URL(req.url, `http://${req.headers.host}`)
    const page = parseInt(url.searchParams.get('page')) || 1
    const limit = parseInt(url.searchParams.get('limit')) || 10
    const sortBy = url.searchParams.get('sortBy') || 'name' // Default sorting by name
    const sortOrder = url.searchParams.get('sortOrder') || 'asc' // Default sorting order ascending

    // Validate sortBy and sortOrder to prevent invalid values
    const validSortFields = ['name', 'email', 'phone', 'points']
    const validSortOrders = ['asc', 'desc']
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'name'
    const sortDirection = validSortOrders.includes(sortOrder) ? sortOrder : 'asc'

    // Fetch users with pagination and sorting
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        points: true
      },
      orderBy: {
        [sortField]: sortDirection
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
            totalUsers,
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
          totalUsers,
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
