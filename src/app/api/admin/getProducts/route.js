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

    const userCafes = await prisma.cafeUser.findMany({
      where: { userId: userId },
      select: { cafeId: true }
    })

    if (userCafes.length === 0) {
      return NextResponse.json({ products: [] })
    }

    // Extract cafe IDs
    const cafeIds = userCafes.map(cafeUser => cafeUser.cafeId)

    // Fetch products for those cafes
    const products = await prisma.product.findMany({
      where: {
        cafeId: { in: cafeIds }
      },
      include: {
        Brand: true,
        Cafe: true,
        variations: true
      }
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
