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

    // Extract and validate pagination and sorting params
    const filters = {
      sortBy: searchParams.get('sortBy'),
      sortOrder: searchParams.get('sortOrder') === 'desc' ? 'desc' : 'asc', // default to 'asc'
      page: Math.max(Number(searchParams.get('page')) || 1, 1), // default to 1, min 1
      pageSize: Math.max(Number(searchParams.get('pageSize')) || 10, 1), // default to 10, min 1
      search: searchParams.get('query'),
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
      return NextResponse.json({
        data: [],
        meta: {
          totalProductsCount: 0,
          currentPage: filters.page,
          pageSize: filters.pageSize,
          totalPages: 0
        }
      })
    }

    // Extract all cafeIds including child cafes
    const cafeIds = extractCafeIds(userCafes)

    // Get the total product count for pagination
    const totalProductsCount = await prisma.product.count({
      where: {
        cafeId: { in: cafeIds },
        AND: filters.search
          ? {
              OR: [
                { name: { contains: filters.search, mode: 'insensitive' } }, // Search in product name
                { Brand: { name: { contains: filters.search, mode: 'insensitive' } } }, // Search in brand name
                { Cafe: { name: { contains: filters.search, mode: 'insensitive' } } }, // Search in cafe name
              ],
            }
          : {},
      },
    })

    if (totalProductsCount === 0) {
      return NextResponse.json({
        data: [],
        meta: {
          totalProductsCount: 0,
          currentPage: filters.page,
          pageSize: filters.pageSize,
          totalPages: 0
        }
      })
    }

    // Fetch products from associated cafes with pagination and sorting
    const products = await prisma.product.findMany({
      where: {
        cafeId: { in: cafeIds },
        AND: filters.search
          ? {
              OR: [
                { name: { contains: filters.search, mode: 'insensitive' } }, // Search in product name
                { Brand: { name: { contains: filters.search, mode: 'insensitive' } } }, // Search in brand name
                { Cafe: { name: { contains: filters.search, mode: 'insensitive' } } }, // Search in cafe name
              ],
            }
          : {},
      },
      orderBy: getOrderBy(filters.sortBy, filters.sortOrder),
      include: {
        Brand: true,
        Cafe: true,
        variations: {
          where: {
            deletedAt: null // Only include variations that are not deleted
          }
        }
      },
      skip: (filters.page - 1) * filters.pageSize,
      take: filters.pageSize
    })

    const totalPages = Math.ceil(totalProductsCount / filters.pageSize)

    // Return the product list with meta information
    return NextResponse.json({
      data: products,
      meta: {
        totalProductsCount,
        currentPage: filters.page,
        pageSize: filters.pageSize,
        totalPages
      }
    })
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

  // Default sorting by product name if no valid sortBy field is provided
  return validSortFields[sortBy] || { name: 'asc' }
}
