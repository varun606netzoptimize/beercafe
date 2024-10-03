import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getUserIdFromToken } from '../../utils/jwt'

const prisma = new PrismaClient()

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)

    const token = req.headers.get('Authorization')?.split(' ')[1]

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = getUserIdFromToken(token)

    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const startYear = parseInt(searchParams.get('startYear'))
    const endYear = parseInt(searchParams.get('endYear'))

    if (isNaN(startYear) || isNaN(endYear) || startYear > endYear) {
      return NextResponse.json({ error: 'Invalid year parameters' }, { status: 400 })
    }

    const cafeUsers = await prisma.cafeUser.findMany({
      where: { userId: userId },
      select: { cafeId: true }
    })

    if (cafeUsers.length === 0) {
      return NextResponse.json([]) // No cafes found for user
    }

    const cafeIds = cafeUsers.map(cu => cu.cafeId)

    const orders = await prisma.order.findMany({
      where: {
        paymentStatus: 'PAID',
        cafeId: { in: cafeIds },
        createdAt: {
          gte: new Date(`${startYear}-01-01`),
          lt: new Date(`${endYear + 1}-01-01`) // Include orders until the end of endYear
        }
      },
      select: {
        createdAt: true,
        cafeId: true,
        amount: true
      }
    })

    const orderCountsByYear = {}

    // Initialize year range
    for (let year = startYear; year <= endYear; year++) {
      orderCountsByYear[year] = { totalOrders: 0, totalRevenue: 0 }
    }

    // Group orders by year
    orders.forEach(order => {
      const orderYear = new Date(order.createdAt).getFullYear()

      if (orderCountsByYear[orderYear]) {
        orderCountsByYear[orderYear].totalOrders += 1
        orderCountsByYear[orderYear].totalRevenue += order.amount
      }
    })

    return NextResponse.json(orderCountsByYear)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
