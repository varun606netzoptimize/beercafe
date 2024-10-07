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

    // Fetch only current month orders for bestCafeOfTheMonth
    const currentMonthCafes = await prisma.cafe.findMany({
      where: {
        cafeUsers: {
          some: {
            userId: userId
          }
        }
      },
      include: {
        children: {
          include: {
            Order: {
              where: {
                paymentStatus: 'PAID',
                createdAt: {
                  gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) // Filter for this month
                }
              }
            }
          }
        },
        Order: {
          where: {
            paymentStatus: 'PAID',
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) // Filter for this month
            }
          }
        }
      }
    })

    let bestCafeOfTheMonth = { name: '', totalRevenue: 0 }

    // Calculate the best cafe of the month based on currentMonthCafes data
    currentMonthCafes.forEach(cafe => {
      const parentRevenue = cafe.Order.reduce((total, order) => total + order.amount, 0)

      const childrenRevenue = cafe.children.reduce((childTotal, childCafe) => {
        return childTotal + childCafe.Order.reduce((total, order) => total + order.amount, 0)
      }, 0)

      // Check if parent cafe has the highest revenue
      if (parentRevenue > bestCafeOfTheMonth.totalRevenue) {
        bestCafeOfTheMonth = { name: cafe.name, totalRevenue: parentRevenue }
      }

      // Check each child cafe's revenue
      cafe.children.forEach(childCafe => {
        const childCafeRevenue = childCafe.Order.reduce((total, order) => total + order.amount, 0)

        if (childCafeRevenue > bestCafeOfTheMonth.totalRevenue) {
          bestCafeOfTheMonth = { name: childCafe.name, totalRevenue: childCafeRevenue }
        }
      })
    })

    const { totalCafes, totalProducts, totalOrders, totalRevenue } = cafes.reduce(
      (acc, cafe) => {
        const parentProductCount = cafe.Product.length

        const childrenProductCount = cafe.children.reduce((childTotal, childCafe) => {
          return childTotal + childCafe.Product.length
        }, 0)

        const parentOrderCount = cafe.Order.length

        const childrenOrderCount = cafe.children.reduce((childTotal, childCafe) => {
          return childTotal + childCafe.Order.length
        }, 0)

        const parentRevenue = cafe.Order.reduce((total, order) => total + order.amount, 0)

        const childrenRevenue = cafe.children.reduce((childTotal, childCafe) => {
          return childTotal + childCafe.Order.reduce((total, order) => total + order.amount, 0)
        }, 0)

        acc.totalCafes += 1 + cafe.children.length
        acc.totalProducts += parentProductCount + childrenProductCount
        acc.totalOrders += parentOrderCount + childrenOrderCount
        acc.totalRevenue += parentRevenue + childrenRevenue

        return acc
      },
      { totalCafes: 0, totalProducts: 0, totalOrders: 0, totalRevenue: 0 }
    )

    const formattedTotalRevenue = parseFloat(totalRevenue.toFixed(2))

    return NextResponse.json(
      {
        totalProducts,
        totalCafes,
        totalOrders,
        totalRevenue: formattedTotalRevenue,
        bestCafeOfTheMonth: bestCafeOfTheMonth,

        cafes: cafes
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching orders:', error)

    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
