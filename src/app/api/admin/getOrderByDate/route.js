import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'

// Initialize Prisma Client
const prisma = new PrismaClient()

export async function GET(req) {
  // Extracting query parameters
  const { searchParams } = new URL(req.url)
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')

  // Validate that startDate and endDate are provided
  if (!startDate || !endDate) {
    return NextResponse.json({ error: 'Both startDate and endDate are required' }, { status: 400 })
  }

  // Parse dates and check for validity
  const parsedStartDate = new Date(startDate)
  const parsedEndDate = new Date(endDate)

  if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
    return NextResponse.json({ error: 'Invalid date format' }, { status: 400 })
  }

  // Ensure startDate is less than endDate
  if (parsedStartDate > parsedEndDate) {
    return NextResponse.json({ error: 'startDate must be before endDate' }, { status: 400 })
  }

  try {
    // Fetching orders between startDate and endDate
    const orders = await prisma.order.findMany({
      where: {
        cafeId: {
          not: null
        },
        createdAt: {
          gte: parsedStartDate, // Greater than or equal to startDate
          lte: parsedEndDate // Less than or equal to endDate
        }
      },
      include: {
        Customer: true,
        Cafe: true,
        CustomerPointsHistory: true,
        details: {
          include: {
            productVariation: {
              include: {
                product: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders by date range:', error)

    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
