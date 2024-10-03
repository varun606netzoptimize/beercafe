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

    const year = searchParams.get('year')

    if (!year) {
      return NextResponse.json({ error: 'Missing year parameter' }, { status: 400 })
    }

    const cafeUsers = await prisma.cafeUser.findMany({
      where: { userId: userId },
      select: { cafeId: true }
    })

    if (cafeUsers.length === 0) {
      return NextResponse.json([])
    }

    const cafeIds = cafeUsers.map(cu => cu.cafeId)

    const orders = await prisma.order.findMany({
      where: {
        paymentStatus: 'PAID',
        cafeId: { in: cafeIds },
        createdAt: {
          gte: new Date(`${year}-01-01`),
          lt: new Date(`${Number(year) + 1}-01-01`)
        }
      },
      select: {
        createdAt: true,
        cafeId: true,
        amount: true
      }
    })

    const orderCountsByMonth = {}

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    monthNames.forEach((month, index) => {
      orderCountsByMonth[month] = { totalOrders: 0, totalRevenue: 0 }
    })

    // Group orders by month
    orders.forEach(order => {
      const orderMonth = new Date(order.createdAt).getMonth() // getMonth returns 0-indexed month (0 = Jan, 11 = Dec)
      const monthName = monthNames[orderMonth]

      orderCountsByMonth[monthName].totalOrders += 1
      orderCountsByMonth[monthName].totalRevenue += order.amount
    })

    return NextResponse.json(orderCountsByMonth)
  } catch (error) {
    console.error('Error fetching orders:', error)

    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
