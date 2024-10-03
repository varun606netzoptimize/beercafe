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
    let search = url.searchParams.get('search') || ''

    // Trim and format the search query
    search = search.trim().replace(/\s+/g, ' ')

    // Validate sortBy and sortOrder
    const validSortFields = ['name', 'location', 'createdAt']
    const validSortOrders = ['asc', 'desc']
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'name'
    const sortDirection = validSortOrders.includes(sortOrder) ? sortOrder : 'asc'

    if (!ownerId) {
      return new NextResponse(JSON.stringify({ message: 'Owner ID is required' }), { status: 400 })
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
        },
        AND: [
          {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { address: { contains: search, mode: 'insensitive' } },
              { location: { contains: search, mode: 'insensitive' } }
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

    // Fetch products for these cafes, including brand and variations
    const products = await prisma.product.findMany({
      where: {
        cafeId: { in: ownedCafeIds }
      },
      include: {
        Brand: true,
        variations: true
      }
    })

    // Apply pagination and sorting
    const sortedAndPagedProducts = products
      .sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1
        if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1

        return 0
      })
      .slice((page - 1) * limit, page * limit)

    // Return the response with pagination info
    const totalProducts = products.length
    const totalPages = Math.ceil(totalProducts / limit)
    const hasNextPage = page < totalPages

    return new NextResponse(
      JSON.stringify({
        message: 'Products fetched successfully',
        products: sortedAndPagedProducts,
        pagination: {
          page,
          limit,
          totalProducts,
          totalPages,
          hasNextPage
        }
      }),
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching products:', error)

    return new NextResponse(JSON.stringify({ message: 'Server error' }), { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
