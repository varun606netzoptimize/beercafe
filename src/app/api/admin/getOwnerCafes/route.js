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
      sortBy: searchParams.get('sortBy') || 'name', // Default sortBy to createdAt
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
            userId: userId
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
        children: {
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
            children: {
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
        },
        cafeUsers: {
          include: {
            user: {
              include: {
                userType: true
              }
            }
          }
        }
      },
      orderBy: getOrderBy(filters.sortBy, filters.sortOrder),
      skip: (filters.page - 1) * filters.pageSize,
      take: filters.pageSize
    })

    // Apply pagination on the sorted cafes
    const totalCafesCount = ownedCafes.length
    const totalPages = Math.ceil(totalCafesCount / filters.pageSize)

    // Return the response with paginated cafes
    return new NextResponse(
      JSON.stringify({
        cafes: ownedCafes,
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

function getOrderBy(sortBy, sortOrder = 'asc') {
  const validSortFields = {
    name: {
      name: sortOrder // Sorting by the name field
    },
    location: {
      location: sortOrder // Sorting by the location field
    },
    address: {
      address: sortOrder // Sorting by the address field
    },
    amount: {
      amount: sortOrder // Sorting by amount in Order model (if applicable)
    }
  }

  // Return the appropriate orderBy field or default to createdAt in descending order
  return validSortFields[sortBy] || { name: 'asc' }
}
