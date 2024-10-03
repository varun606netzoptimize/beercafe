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

    // Fetch cafes owned by the user
    const cafeUsers = await prisma.cafeUser.findMany({
      where: { userId },
      select: { cafeId: true }
    })

    if (cafeUsers.length === 0) {
      return NextResponse.json([])
    }

    const parentCafeIds = cafeUsers.map(cu => cu.cafeId)

    // Fetch child cafes of the parent cafes
    const childCafes = await prisma.cafe.findMany({
      where: { parentId: { in: parentCafeIds } },
      select: { id: true }
    })

    // Combine parent and child cafe ids
    const allCafeIds = [...parentCafeIds, ...childCafes.map(child => child.id)]

    // Fetch orders from both parent and child cafes
    const orders = await prisma.order.findMany({
      where: {
        paymentStatus: 'PAID',
        cafeId: { in: allCafeIds },
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

    for (const day in orderCountsByDay) {
      orderCountsByDay[day].totalRevenue = Math.floor(orderCountsByDay[day].totalRevenue)
    }

    return NextResponse.json(orderCountsByDay)
  } catch (error) {
    console.error('Error fetching orders:', error)

    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
