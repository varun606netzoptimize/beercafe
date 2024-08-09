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

    // Validate sortBy and sortOrder
    const validSortFields = ['name', 'location', 'createdAt']
    const validSortOrders = ['asc', 'desc']
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'name'
    const sortDirection = validSortOrders.includes(sortOrder) ? sortOrder : 'asc'

    if (!ownerId) {
      return new NextResponse(JSON.stringify({ message: 'Owner ID is required' }), {
        status: 400
      })
    }

    // Get all cafes owned by the user
    const ownedCafes = await prisma.cafe.findMany({
      where: {
        cafeUsers: {
          some: {
            userId: ownerId,
            user: {
              userType: {
                type: 'owner'
              }
            }
          }
        }
      },
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

    // Extract the IDs of the owned cafes
    const ownedCafeIds = ownedCafes.map(cafe => cafe.id)

    // Get cafes where parentId matches any of the owned cafe IDs
    const childCafes = await prisma.cafe.findMany({
      where: {
        parentId: {
          in: ownedCafeIds
        }
      },
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

    // Combine owned cafes and child cafes
    const result = [...ownedCafes, ...childCafes]

    // Apply pagination and sorting
    const sortedAndPagedResult = result
      .sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1
        if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1

        return 0
      })
      .slice((page - 1) * limit, page * limit)

    // Map the cafes to include user and owner information
    const resultWithUsers = sortedAndPagedResult.map(cafe => {
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

    // Calculate total number of pages
    const totalCafes = result.length
    const totalPages = Math.ceil(totalCafes / limit)
    const hasNextPage = page < totalPages

    // Return the response with pagination info
    return new NextResponse(
      JSON.stringify({
        message: 'Cafes fetched successfully',
        cafes: resultWithUsers,
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
