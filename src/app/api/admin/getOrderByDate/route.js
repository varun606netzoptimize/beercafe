import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'

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
  const { searchParams } = new URL(req.url)

  // Extract query parameters, with 'query' being the generic search term for customers or cafes
  const filters = {
    startDate: searchParams.get('startDate'),
    endDate: searchParams.get('endDate'),
    search: searchParams.get('query'), // General search for customer or cafe
    paymentStatus: searchParams.get('paymentStatus'),
    paymentMode: searchParams.get('paymentMode')
  }

  // Validate filters
  const errors = validateFilters(filters)

  if (errors.length > 0) {
    return NextResponse.json({ error: errors }, { status: 400 })
  }

  try {
    // Construct dynamic where clause based on filters
    const whereClause = {
      // Date range filter, only applied if both startDate and endDate are provided
      ...(filters.startDate &&
        filters.endDate && {
          createdAt: {
            gte: new Date(filters.startDate),
            lte: new Date(filters.endDate)
          }
        }),

      // Payment status filter, applied if provided
      ...(filters.paymentStatus && { paymentStatus: filters.paymentStatus }),

      // Payment mode filter, applied if provided
      ...(filters.paymentMode && { paymentMode: filters.paymentMode }),

      // General search applied to both Customer names and Cafe names
      ...(filters.search && {
        OR: [
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
      })
    }

    // Fetch orders based on filters
    const orders = await prisma.order.findMany({
      where: whereClause,
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
