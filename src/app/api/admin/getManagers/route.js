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
    const sortBy = url.searchParams.get('sortBy') || 'name' // Default to sorting by name
    const sortOrder = url.searchParams.get('sortOrder') || 'asc' // Default to ascending order

    // Determine the orderBy parameter
    const orderBy = sortBy === 'cafe' ? { cafe: { name: sortOrder } } : { [sortBy]: sortOrder }

    // Fetch managers with pagination and sorting
    const managers = await prisma.manager.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        cafeId: true,
        cafe: {
          select: {
            id: true,
            name: true,
            location: true
          }
        }
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit
    })

    // Get the total number of managers
    const totalManagers = await prisma.manager.count()

    // Calculate total number of pages
    const totalPages = Math.ceil(totalManagers / limit)
    const hasNextPage = page < totalPages

    // Check if the current page has no managers
    if (managers.length === 0 && page > totalPages) {
      return new Response(
        JSON.stringify({
          message: 'No managers found',
          managers: [],
          pagination: {
            page,
            limit,
            totalPages,
            totalManagers,
            hasNextPage: false
          }
        }),
        { status: 200 }
      )
    }

    console.log('Fetched managers:', managers)

    return new Response(
      JSON.stringify({
        message: 'Managers fetched successfully',
        managers,
        pagination: {
          page,
          limit,
          totalPages,
          totalManagers,
          hasNextPage
        }
      }),
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching managers:', error)

    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 })
  }
}
