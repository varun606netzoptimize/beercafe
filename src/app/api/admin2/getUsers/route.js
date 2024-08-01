import { PrismaClient } from '@prisma/client'

import { verifyAdmin } from '../../utils/verifyAdmin'

const prisma = new PrismaClient()

export async function GET(req) {
  const adminAuthResponse = await verifyAdmin(req)

  if (adminAuthResponse) return adminAuthResponse

  try {
    // Extract pagination and sorting parameters from query
    const url = new URL(req.url, `http://${req.headers.host}`)
    const page = parseInt(url.searchParams.get('page')) || 1
    const limit = parseInt(url.searchParams.get('limit')) || 10
    const sortBy = url.searchParams.get('sortBy') || 'name' // Default sorting by name
    const sortOrder = url.searchParams.get('sortOrder') || 'asc' // Default sorting order ascending
    const userType = url.searchParams.get('userType') // Get userType from query parameters

    // Validate sortBy and sortOrder to prevent invalid values
    const validSortFields = ['name', 'email', 'phone', 'points']
    const validSortOrders = ['asc', 'desc']
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'name'
    const sortDirection = validSortOrders.includes(sortOrder) ? sortOrder : 'asc'

    // Determine roleId based on userType
    let roleId
    let includeCafes = false

    switch (userType) {
      case 'manager':
        roleId = '66ab602a353d40f4a7f8b439'
        includeCafes = true
        break
      case 'owner':
        roleId = '66ab602a353d40f4a7f8b438'
        includeCafes = true
        break
      case 'admin':
        roleId = '66ab602a353d40f4a7f8b437'
        break
      case 'user':
        roleId = '66ab602a353d40f4a7f8b43a'
        break
      default:
        roleId = null
    }

    // Fetch users with pagination, sorting, and optional cafe details
    const users = await prisma.user.findMany({
      where: roleId ? { roleId } : {}, // Filter by roleId if it's defined
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        points: true,
        ownedCafes: includeCafes ? { select: { id: true, name: true, location: true } } : false,
        managedCafes: includeCafes ? { select: { id: true, name: true, location: true } } : false
      },
      orderBy: {
        [sortField]: sortDirection
      },
      skip: (page - 1) * limit,
      take: limit
    })

    // Get the total number of users based on the roleId filter
    const totalUsers = await prisma.user.count({
      where: roleId ? { roleId } : {} // Count users with the roleId filter
    })

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
