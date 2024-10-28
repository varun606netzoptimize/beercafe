import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'

import { getUserIdFromToken } from '../../utils/jwt'

const prisma = new PrismaClient()

export async function GET(req) {
  try {
    const url = new URL(req.url)
    const searchParams = url.searchParams

    const token = req.headers.get('Authorization')?.split(' ')[1]

    if (!token) {
      return NextResponse.json(
        {
          error: 'Unauthorized'
        },
        { status: 401 }
      )
    }

    const userId = getUserIdFromToken(token)

    // If userId is invalid
    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Extract and validate pagination and sorting params
    const filters = {
      cafeId: searchParams.get('cafeId'),
      sortBy: searchParams.get('sortBy'),
      sortOrder: searchParams.get('sortOrder') === 'desc' ? 'desc' : 'asc', // default to 'asc'
      page: Math.max(Number(searchParams.get('page')) || 1, 1), // default to 1, min 1
      pageSize: Math.max(Number(searchParams.get('pageSize')) || 10, 1), // default to 10, min 1
      search: searchParams.get('query')
    }

    filters.search = filters.search?.trim().replace(/\s+/g, ' ')

    // Fetch cafes associated with the user
    const ownedCafes = await prisma.cafe.findMany({
      where: {
        cafeUsers: {
          some: {
            userId: userId
          }
        },
        ...(filters.search && {
          OR: [
            {
              // Search in parent cafe
              OR: [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { address: { contains: filters.search, mode: 'insensitive' } },
                { location: { contains: filters.search, mode: 'insensitive' } }
              ]
            },
            {
              // Search in child cafes
              children: {
                some: {
                  OR: [
                    { name: { contains: filters.search, mode: 'insensitive' } },
                    { address: { contains: filters.search, mode: 'insensitive' } },
                    { location: { contains: filters.search, mode: 'insensitive' } }
                  ]
                }
              }
            }
          ]
        })
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
                },
                cafe: true
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
                    },
                    cafe: true
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
            },
            cafe: true
          }
        }
      },

      // orderBy: getOrderBy(filters.sortBy, filters.sortOrder),

      skip: (filters.page - 1) * filters.pageSize,
      take: filters.pageSize
    })

    // If user has no cafes
    if (ownedCafes.length === 0) {
      return NextResponse.json({
        users: [],
        meta: {
          totalUsers: 0,
          currentPage: filters.page,
          pageSize: filters.pageSize,
          totalPages: 0
        }
      })
    }

    const userCafes = []

    ownedCafes.forEach(cafe => {
      cafe.cafeUsers.forEach(user => {
        userCafes.push(user)
      })

      cafe.children.forEach(child => {
        child.cafeUsers.forEach(user => {
          userCafes.push(user)
        })
      })
    })

    const uniqueUsers = Array.from(new Map(userCafes.map(user => [user.id, user])).values())

    return NextResponse.json({
      users: uniqueUsers,
      meta: {
        totalUsers: 0,
        currentPage: filters.page,
        pageSize: filters.pageSize,
        totalUsers: uniqueUsers.length

        // totalPages
      }
    })
  } catch (err) {
    console.log(err, 'Error')

    return NextResponse.json({ error: err }, { status: 500 })
  }
}

function getOrderBy(sortBy, sortOrder) {
  const validSortFields = {
    cafeName: {
      cafeUsers: {
        user: {
          name: sortOrder
        }
      }
    },
    userName: {
      cafeUsers: {
        user: {
          name: sortOrder
        }
      }
    },
    email: {
      cafeUsers: {
        user: {
          email: sortOrder
        }
      }
    }
  }

  return (
    validSortFields[sortBy] || {
      cafeUsers: {
        user: {
          name: 'asc'
        }
      }
    }
  )
}
