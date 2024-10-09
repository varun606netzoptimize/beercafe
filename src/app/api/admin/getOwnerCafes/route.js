import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'

import { getUserIdFromToken } from '../../utils/jwt'

const prisma = new PrismaClient()

export async function GET(req) {
  const { searchParams } = new URL(req.url)

  try {
    const token = req.headers.get('Authorization')?.split(' ')[1]

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = getUserIdFromToken(token)

    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const filters = {
      search: searchParams.get('search'), // General search for customer or cafe
      sortBy: searchParams.get('sortBy') || 'createdAt', // Default sortBy to createdAt
      sortOrder: searchParams.get('sortOrder') || 'asc', // Default sortOrder to ascending
      page: Number(searchParams.get('page')) || 1,
      pageSize: Number(searchParams.get('pageSize')) || 10
    }

    // Trim and format the search query
    filters.search = filters.search?.trim().replace(/\s+/g, ' ')

    // Get all cafes owned by the user
    const ownedCafes = await prisma.cafe.findMany({
      where: {
        cafeUsers: {
          some: {
            userId: userId,
            user: {
              userType: {
                type: 'owner'
              }
            }
          }
        },
        AND: [
          {
            OR: [
              { name: { contains: filters.search, mode: 'insensitive' } },
              { address: { contains: filters.search, mode: 'insensitive' } },
              { location: { contains: filters.search, mode: 'insensitive' } }
            ]
          }
        ]
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
        },
        AND: [
          {
            OR: [
              { name: { contains: filters.search, mode: 'insensitive' } },
              { address: { contains: filters.search, mode: 'insensitive' } },
              { location: { contains: filters.search, mode: 'insensitive' } }
            ]
          }
        ]
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

    // Helper function to separate owners and users
    const categorizeUsers = cafeUsers => {
      const owners = []
      const users = []

      cafeUsers.forEach(cafeUser => {
        const userType = cafeUser.user.userType?.type

        if (userType === 'owner') {
          owners.push(cafeUser.user)
        } else {
          users.push(cafeUser.user)
        }
      })

      return { owners, users }
    }

    // Categorize owners and users for each cafe
    let cafesWithUserCategories = [...ownedCafes, ...childCafes].map(cafe => {
      const { owners, users } = categorizeUsers(cafe.cafeUsers)

      return {
        ...cafe,
        owners,
        users
      }
    })

    // Implement sorting based on the provided sortBy and sortOrder
    cafesWithUserCategories.sort((a, b) => {
      let fieldA = a[filters.sortBy]?.toString().toLowerCase() || ''
      let fieldB = b[filters.sortBy]?.toString().toLowerCase() || ''

      if (filters.sortOrder === 'asc') {
        return fieldA.localeCompare(fieldB)
      } else {
        return fieldB.localeCompare(fieldA)
      }
    })

    // Apply pagination on the sorted cafes
    const totalCafesCount = cafesWithUserCategories.length
    const totalPages = Math.ceil(totalCafesCount / filters.pageSize)

    // Implement skip and take for pagination on the final sorted data
    const paginatedCafes = cafesWithUserCategories.slice(
      (filters.page - 1) * filters.pageSize,
      filters.page * filters.pageSize
    )

    // Return the response with paginated cafes
    return new NextResponse(
      JSON.stringify({
        cafes: paginatedCafes,
        meta: {
          currentPage: filters.page,
          pageSize: filters.pageSize,
          totalPages,
          totalCafesCount
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
