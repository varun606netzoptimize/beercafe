import { Children } from 'react'

import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'

import { includes } from 'valibot'

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

    const userCafes = await prisma.cafeUser.findMany({
      where: { userId: userId },

      // select: { cafeId: true },
      include: {
        cafe: {
          include: {
            children: true
          }
        }
      }
    })

    if (userCafes.length === 0) {
      return NextResponse.json({ products: [] })
    }

    const cafeIds = extractCafeIds(userCafes)

    let products = await prisma.product.findMany({
      where: {
        cafeId: { in: cafeIds }
      },
      include: {
        Brand: true,
        Cafe: true,
        variations: {
          where: {
            NOT: {
              deletedAt: {
                not: null
              }
           }
          }
        }
      }
    })

    // products = products.map(product => {
    //   return {
    //     ...product,
    //     variations: product.variations.filter(variation => {
    //       return variation.deletedAt == null
    //     })
    //   }
    // })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)

return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

const extractCafeIds = userCafes => {
  const ids = []

  userCafes.forEach(item => {
    if (item.cafe) {
      ids.push(item.cafe.id)
      item.cafe.children?.forEach(child => ids.push(child.id))
    }
  })

  return ids
}
