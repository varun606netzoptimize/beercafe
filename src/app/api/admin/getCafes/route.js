import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req) {
  try {
    // Extract pagination and sorting parameters from query
    const url = new URL(req.url, `http://${req.headers.host}`)
    const page = parseInt(url.searchParams.get('page')) || 1
    const limit = parseInt(url.searchParams.get('limit')) || 10
    const sortBy = url.searchParams.get('sortBy') || 'name'
    const sortOrder = url.searchParams.get('sortOrder') || 'asc'
    const ownerId = url.searchParams.get('ownerId')
    const parentId = url.searchParams.get('parentId')

    // Validate sortBy and sortOrder
    const validSortFields = ['name', 'location', 'createdAt']
    const validSortOrders = ['asc', 'desc']
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'name'
    const sortDirection = validSortOrders.includes(sortOrder) ? sortOrder : 'asc'

    // Build the filter object based on ownerId and parentId
    const filters = {}

    if (ownerId) filters.ownerId = ownerId
    if (parentId) filters.parentId = parentId

    // Fetch cafes with pagination and sorting, including associated users and parent cafe owner
    const cafes = await prisma.cafe.findMany({
      where: filters,
      orderBy: { [sortField]: sortDirection },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        cafeUsers: {
          include: {
            user: {
              include: {
                userType: true
              }
            }
          }
        },
        parent: {
          include: {
            cafeUsers: {
              include: {
                user: {
                  include: {
                    userType: true
                  }
                }
              }
            }
          }
        }
      }
    })

    // Get the total number of cafes based on the filters
    const totalCafes = await prisma.cafe.count({ where: filters })

    // Calculate total number of pages
    const totalPages = Math.ceil(totalCafes / limit)
    const hasNextPage = page < totalPages

    // Map the cafes to include user and user type information
    const result = cafes.map(cafe => {
      // Get the owner from the parent cafe if parentId exists
      let owner = null

      if (cafe.parent) {
        const parentOwner = cafe.parent.cafeUsers.find(cafeUser => cafeUser.user.userType.type === 'owner')

        if (parentOwner) {
          owner = parentOwner.user
        }
      }

      // If owner is not set, get it from the current cafe's users
      if (!owner) {
        const currentCafeOwners = cafe.cafeUsers.filter(cafeUser => cafeUser.user.userType.type === 'owner')

        owner = currentCafeOwners.length > 0 ? currentCafeOwners[0].user : null
      }

      return {
        id: cafe.id,
        name: cafe.name,
        location: cafe.location,
        address: cafe.address,
        description: cafe.description,
        priceConversionRate: cafe.priceConversionRate,
        parentId: cafe.parentId,
        owner: owner
          ? {
              id: owner.id,
              name: owner.name,
              email: owner.email,
              phoneNumber: owner.phoneNumber,
              userType: owner.userType.type,
              createdAt: owner.createdAt,
              updatedAt: owner.updatedAt,
              deletedAt: owner.deletedAt
            }
          : null,
        createdAt: cafe.createdAt,
        updatedAt: cafe.updatedAt,
        deletedAt: cafe.deletedAt,
        users: cafe.cafeUsers
          .filter(cafeUser => cafeUser.user.userType.type !== 'owner') // Exclude owners
          .map(cafeUser => ({
            id: cafeUser.user.id,
            name: cafeUser.user.name,
            email: cafeUser.user.email,
            phoneNumber: cafeUser.user.phoneNumber,
            userType: cafeUser.user.userType.type,
            createdAt: cafeUser.user.createdAt,
            updatedAt: cafeUser.user.updatedAt,
            deletedAt: cafeUser.user.deletedAt
          }))
      }
    })

    // Return the response with pagination info
    return new NextResponse(
      JSON.stringify({
        message: 'Cafes fetched successfully',
        cafes: result,
        pagination: {
          page,
          limit,
          totalCafes,
          totalPages,
          hasNextPage
        }
      }),
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching cafes:', error)

    return new NextResponse(JSON.stringify({ message: 'Server error' }), { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
