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

  // Extract query parameters
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
    // Initialize an empty where clause
    const whereClause = {}

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
