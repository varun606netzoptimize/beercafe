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

    // Get current date
    const today = new Date()

    // Get the first day (Sunday) and last day (Saturday) of the current week
    const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()))
    const lastDayOfWeek = new Date(today.setDate(today.getDate() + 6))

    // Reset the time for start and end of the day
    firstDayOfWeek.setHours(0, 0, 0, 0)
    lastDayOfWeek.setHours(23, 59, 59, 999)

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
          gte: firstDayOfWeek,
          lte: lastDayOfWeek
        }
      },
      select: {
        createdAt: true,
        cafeId: true,
        amount: true
      }
    })

    const orderCountsByDay = {}

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    // Initialize object for days of the week (0: Sunday, 6: Saturday)
    weekDays.forEach(day => {
      orderCountsByDay[day] = { totalOrders: 0, totalRevenue: 0 }
    })

    // Group orders by day of the week
    orders.forEach(order => {
      const orderDay = new Date(order.createdAt).getDay() // getDay returns day of the week (0 = Sunday, 6 = Saturday)
      const dayName = weekDays[orderDay]

      orderCountsByDay[dayName].totalOrders += 1
      orderCountsByDay[dayName].totalRevenue += order.amount
    })

    return NextResponse.json(orderCountsByDay)
  } catch (error) {
    console.error('Error fetching orders:', error)

    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
