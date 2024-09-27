import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'

import { getUserIdFromToken } from '../../utils/jwt'

// Initialize Prisma Client
const prisma = new PrismaClient()

// Helper function for validation
function validateFilters(filters) {
  const errors = []

  // Validate date formats if present
  if (filters.startDate) {
    const parsedStartDate = new Date(filters.startDate)

    if (isNaN(parsedStartDate.getTime())) {
      errors.push('Invalid startDate format.')
    }
  }

  if (filters.endDate) {
    const parsedEndDate = new Date(filters.endDate)

    if (isNaN(parsedEndDate.getTime())) {
      errors.push('Invalid endDate format.')
    }
  }

  // Validate startDate before endDate if both provided
  if (filters.startDate && filters.endDate) {
    const parsedStartDate = new Date(filters.startDate)
    const parsedEndDate = new Date(filters.endDate)

    if (parsedStartDate > parsedEndDate) {
      errors.push('startDate must be before endDate.')
    }
  }

  return errors
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const token = req.headers.get('Authorization')?.split(' ')[1]

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = getUserIdFromToken(token)

  if (!userId) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  // Extract query parameters
  const filters = {
    startDate: searchParams.get('startDate'),
    endDate: searchParams.get('endDate'),
    search: searchParams.get('query'), // General search for customer or cafe
    paymentStatus: searchParams.get('paymentStatus'),
    paymentMode: searchParams.get('paymentMode'),
    sortBy: searchParams.get('sortBy'),
    sortOrder: searchParams.get('sortOrder'),
    page: Number(searchParams.get('page')),
    pageSize: Number(searchParams.get('pageSize'))
  }

  // Validate filters
  const errors = validateFilters(filters)

  if (errors.length > 0) {
    return NextResponse.json({ error: errors }, { status: 400 })
  }

  try {

    const cafeUsers = await prisma.cafeUser.findMany({
      where: {userId: userId},
      select : {cafeId: true}
    })

    if(cafeUsers.length === 0){
      return NextResponse.json([]);
    }

    const cafeIds = cafeUsers.map(cu => cu.cafeId);

    // Initialize an empty where clause
    const whereClause = {
      cafeId : {
        in: cafeIds
      }
    }

    // Apply start date filter if present
    if (filters.startDate) {
      whereClause.createdAt = { gte: new Date(filters.startDate) }
    }

    // Apply end date filter if present, adding to `createdAt` if already set
    if (filters.endDate) {
      const endDateWithTime = new Date(filters.endDate)

      endDateWithTime.setHours(23, 59, 59, 999) // Set time to end of the day
      whereClause.createdAt = {
        ...(whereClause.createdAt || {}),
        lte: endDateWithTime
      }
    }

    // Apply payment status filter, if provided
    if (filters.paymentStatus) {
      whereClause.paymentStatus = filters.paymentStatus
    }

    // Apply payment mode filter, if provided
    if (filters.paymentMode) {
      whereClause.paymentMode = filters.paymentMode
    }

    // Apply general search filter for Customer and Cafe
    if (filters.search) {
      whereClause.OR = [
        {
          Customer: {
            OR: [
              { firstname: { contains: filters.search, mode: 'insensitive' } },
              { lastname: { contains: filters.search, mode: 'insensitive' } }
            ]
          }
        },
        {
          Cafe: {
            name: { contains: filters.search, mode: 'insensitive' }
          }
        }
      ]
    }

    // Fetch orders based on the where clause
    const orders = await prisma.order.findMany({
      where: whereClause,
      orderBy: getOrderBy(filters.sortBy, filters.sortOrder),
      include: {
        Customer: true,
        Cafe: true,
        CustomerPointsHistory: true,
        details: {
          include: {
            productVariation: {
              include: { product: true }
            }
          }
        }
      }
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)

    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

function getOrderBy(sortBy, sortOrder) {
  const validSortFields = {
    customerName: {
      Customer: { firstname: sortOrder || 'asc' }, // Default to ascending if no order provided
    },
    cafeName: {
      Cafe: { name: sortOrder || 'asc' },
    },
    amount: {
      amount: sortOrder || 'asc',
    },
    createdAt: {
      createdAt: sortOrder || 'asc',
    },
  };

  // Return the appropriate orderBy field
  return validSortFields[sortBy] || { createdAt: 'desc' }; // Default sort by createdAt if invalid
}
