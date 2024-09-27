import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'

import { getUserIdFromToken } from '../../utils/jwt'

const prisma = new PrismaClient()

export async function GET(req) {
  try {
    // Parse query params
    const url = new URL(req.url)
    const searchParams = url.searchParams

    // Get the token from headers
    const token = req.headers.get('Authorization')?.split(' ')[1]

    // Check if token exists
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get userId from the token
    const userId = getUserIdFromToken(token)

    // If userId is invalid
    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Extract filters from query params
    const filters = {
      sortBy: searchParams.get('sortBy'),
      sortOrder: searchParams.get('sortOrder') || 'asc', // default sortOrder
      page: Number(searchParams.get('page')) || 1,
      pageSize: Number(searchParams.get('pageSize')) || 10
    }

    // Validate pagination params
    if (filters.page <= 0 || filters.pageSize <= 0) {
      return NextResponse.json({ error: 'Invalid pagination values' }, { status: 400 })
    }

    // Fetch cafes associated with the user
    const userCafes = await prisma.cafeUser.findMany({
      where: { userId: userId },
      include: {
        cafe: {
          include: {
            children: true
          }
        }
      }
    })

    // If user has no cafes
    if (userCafes.length === 0) {
      return NextResponse.json({ products: [] })
    }

    // Extract all cafeIds including child cafes
    const cafeIds = extractCafeIds(userCafes)

    // Fetch products from associated cafes
    const products = await prisma.product.findMany({
      where: {
        cafeId: { in: cafeIds }
      },
      orderBy: getOrderBy(filters.sortBy, filters.sortOrder),
      include: {
        Brand: true,
        Cafe: true,
        variations: {
          where: {
            NOT: {
              deletedAt: {
                not: null
              }
            }
          }
        }
      },
      skip: (filters.page - 1) * filters.pageSize,
      take: filters.pageSize
    })

    // Return the product list
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// Helper to extract cafeIds from the user's cafes
const extractCafeIds = userCafes => {
  const ids = []

  userCafes.forEach(item => {
    if (item.cafe) {
      ids.push(item.cafe.id)
      item.cafe.children?.forEach(child => ids.push(child.id))
    }
  })

  return ids
}

// Helper to get orderBy object based on sortBy and sortOrder
function getOrderBy(sortBy, sortOrder) {
  const validSortFields = {
    brandName: { Brand: { name: sortOrder } },
    cafeName: { Cafe: { name: sortOrder } },
    productName: { name: sortOrder },
    quantity: { quantity: sortOrder }
  }

  // Default sorting by brandName if no valid sortBy field is provided
  return validSortFields[sortBy] || { Brand: { name: 'asc' } }
}
