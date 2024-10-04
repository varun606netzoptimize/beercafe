import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'

import { getUserIdFromToken } from '../../utils/jwt'

const prisma = new PrismaClient()

export async function GET(req) {
  const { searchParams } = new URL(req.url)

  const token = req.headers.get('Authorization')?.split(' ')[1]

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = getUserIdFromToken(token)

  if (!userId) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  console.log(userId, 'userId')

  try {
    const cafes = await prisma.cafe.findMany({
      where: {
        cafeUsers: {
          some: {
            userId: userId // Filter cafes by the user's ID
          }
        }
      },
      include: {
        // cafeUsers: true,
        children: {
          include: {
            Product: true,
            Order: {
              where: {
                paymentStatus: 'PAID'
              }
            }
          }
        },
        Product: true,
        Order: {
          where: {
            paymentStatus: 'PAID'
          }
        }
      }
    })

    const { totalCafes, totalProducts, totalOrders } = cafes.reduce(
      (acc, cafe) => {
        const parentProductCount = cafe.Product.length

        const childrenProductCount = cafe.children.reduce((childTotal, childCafe) => {
          return childTotal + childCafe.Product.length
        }, 0)

        const parentOrderCount = cafe.Order.length

        const childrenOrderCount = cafe.children.reduce((childTotal, childCafe) => {
          return childTotal + childCafe.Order.length
        }, 0)

        acc.totalCafes += 1 + cafe.children.length
        acc.totalProducts += parentProductCount + childrenProductCount
        acc.totalOrders += parentOrderCount + childrenOrderCount

        return acc
      },
      { totalCafes: 0, totalProducts: 0, totalOrders: 0 }
    )

    return NextResponse.json(
      {
        totalProducts,
        totalCafes,
        totalOrders,
        cafes: cafes
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching orders:', error)

    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
