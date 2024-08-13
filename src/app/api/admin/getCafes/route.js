import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req) {
  try {
    // Extract pagination, sorting, and search parameters from query
    const url = new URL(req.url, `http://${req.headers.host}`)
    const page = parseInt(url.searchParams.get('page')) || 1
    const limit = parseInt(url.searchParams.get('limit')) || 10
    const sortBy = url.searchParams.get('sortBy') || 'name'
    const sortOrder = url.searchParams.get('sortOrder') || 'asc'
    const ownerId = url.searchParams.get('ownerId')
    const parentId = url.searchParams.get('parentId')
    const search = url.searchParams.get('search') || ''

    // Validate sortBy and sortOrder
    const validSortFields = ['name', 'location', 'createdAt']
    const validSortOrders = ['asc', 'desc']
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'name'
    const sortDirection = validSortOrders.includes(sortOrder) ? sortOrder : 'asc'

    // Build the filter object based on ownerId, parentId, and search
    const filters = {}

    if (ownerId) filters.ownerId = ownerId
    if (parentId) filters.parentId = parentId

    if (search) {
      filters.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } }
      ]
    }

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
      let owners = []

      // Collect owners from the parent cafe if it exists
      if (cafe.parent) {
        const parentOwners = cafe.parent.cafeUsers.filter(cafeUser => cafeUser.user.userType.type === 'owner')

        if (parentOwners.length > 0) {
          owners.push(
            ...parentOwners.map(owner => ({
              id: owner.user.id,
              name: owner.user.name,
              email: owner.user.email,
              phoneNumber: owner.user.phoneNumber,
              userType: owner.user.userType.type,
              createdAt: owner.user.createdAt,
              updatedAt: owner.user.updatedAt,
              deletedAt: owner.user.deletedAt
            }))
          )
        }
      }

      // Collect owners from the current cafe
      const currentCafeOwners = cafe.cafeUsers.filter(cafeUser => cafeUser.user.userType.type === 'owner')

      if (currentCafeOwners.length > 0) {
        owners.push(
          ...currentCafeOwners.map(owner => ({
            id: owner.user.id,
            name: owner.user.name,
            email: owner.user.email,
            phoneNumber: owner.user.phoneNumber,
            userType: owner.user.userType.type,
            createdAt: owner.user.createdAt,
            updatedAt: owner.user.updatedAt,
            deletedAt: owner.user.deletedAt
          }))
        )
      }

      return {
        id: cafe.id,
        name: cafe.name,
        location: cafe.location,
        address: cafe.address,
        description: cafe.description,
        priceConversionRate: cafe.priceConversionRate,
        parentId: cafe.parentId,
        owners: owners,
        createdAt: cafe.createdAt,
        updatedAt: cafe.updatedAt,
        deletedAt: cafe.deletedAt,
        users: cafe.cafeUsers
          .filter(cafeUser => cafeUser.user.userType.type !== 'owner') // Exclude owners from the users list
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

    return new NextResponse(JSON.stringify({ message: 'Server error' }), {
      status: 500
    })
  } finally {
    await prisma.$disconnect()
  }
}
