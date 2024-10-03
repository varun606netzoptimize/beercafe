import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'

import { getUserIdFromToken } from '../../utils/jwt'

const prisma = new PrismaClient()

export async function GET(req) {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1]

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = getUserIdFromToken(token)

    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Get all cafes for the user
    const cafeUsers = await prisma.cafeUser.findMany({
      where: { userId: userId },
      select: { cafeId: true }
    })

    if (cafeUsers.length === 0) {
      return NextResponse.json({ message: 'No cafes found for this user.' }, { status: 404 })
    }

    const cafeIds = cafeUsers.map(cu => cu.cafeId)

    // Total Cafes for the user
    const totalCafes = cafeIds.length

    // Total Orders and Total Revenue
    const orders = await prisma.order.findMany({
      where: {
        deletedAt: null, // Include only non-deleted orders
        cafeId: { in: cafeIds } // Filter orders by user's cafes
      },
      include: {
        details: true // Include order details to calculate revenue
      }
    })

    const totalOrders = orders.length

    const totalRevenue = orders.reduce((total, order) => {
      return total + order.amount // Assuming `amount` is the revenue for each order
    }, 0)

    // Total Products for the cafes associated with the user
    const totalProducts = await prisma.product.count({
      where: {
        cafeId: { in: cafeIds }
      }
    })

    // Fetch Parent and Child Cafes for the user's cafes
    const cafes = await prisma.cafe.findMany({
      where: {
        id: { in: cafeIds }
      },
      include: {
        children: true, // Include child cafes
        parent: true // Include parent cafe if exists
      }
    })

    // Get IDs of all child cafes for the user's cafes
    const childCafeIds = cafes.flatMap(cafe => cafe.children.map(child => child.id))

    // Fetch details of child cafes and total count of all cafes (including children)
    const childCafes = await prisma.cafe.findMany({
      where: {
        id: { in: childCafeIds }
      },
      include: {
        parent: true // Include parent cafe if exists
      }
    })

    // Total count of all cafes including child and parent cafes
    const totalAllCafes = totalCafes + childCafes.length

    return NextResponse.json({
      totalCafes: totalAllCafes, // Include all cafes
      totalOrders,
      totalRevenue,
      totalProducts,
      cafes,
      childCafes // Include child cafes in the response
    })
  } catch (error) {
    console.error('Error fetching stats:', error)

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
