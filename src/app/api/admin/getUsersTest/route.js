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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = getUserIdFromToken(token)

    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const filters = {
      cafeId: searchParams.get('cafeId'),
      sortBy: searchParams.get('sortBy'),
      sortOrder: searchParams.get('sortOrder') === 'desc' ? 'desc' : 'asc',
      page: Math.max(Number(searchParams.get('page')) || 1, 1),
      pageSize: Math.max(Number(searchParams.get('pageSize')) || 10, 1),
      search: searchParams.get('search')?.trim().replace(/\s+/g, ' ')
    }

    // Fetch cafes without sorting on deeply nested fields
    const ownedCafes = await prisma.cafe.findMany({
      where: {
        cafeUsers: {
          some: { userId: userId }
        },
        ...(filters.search && {
          OR: [
            {
              OR: [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { address: { contains: filters.search, mode: 'insensitive' } },
                { location: { contains: filters.search, mode: 'insensitive' } }
              ]
            },
            {
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
                  include: { userType: true }
                },
                cafe: true
              }
            }
          }
        },
        cafeUsers: {
          include: {
            user: {
              include: { userType: true }
            },
            cafe: true
          }
        }
      },
      skip: (filters.page - 1) * filters.pageSize,
      take: filters.pageSize
    })

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
      cafe.cafeUsers.forEach(user => userCafes.push(user))
      cafe.children.forEach(child => child.cafeUsers.forEach(user => userCafes.push(user)))
    })

    const uniqueUsers = Array.from(new Map(userCafes.map(user => [user.id, user])).values())

    // Sort unique users manually based on the desired field
    const sortedUsers = uniqueUsers.sort((a, b) => {
      const field = filters.sortBy === 'email' ? 'email' : 'name'
      const order = filters.sortOrder === 'desc' ? -1 : 1

      const aField = a.user[field] || ''
      const bField = b.user[field] || ''

      return aField.localeCompare(bField) * order
    })

    return NextResponse.json({
      users: sortedUsers,
      meta: {
        totalUsers: sortedUsers.length,
        currentPage: filters.page,
        pageSize: filters.pageSize,
        totalPages: Math.ceil(sortedUsers.length / filters.pageSize)
      }
    })
  } catch (err) {
    console.log(err, 'Error')

    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
  }
}
