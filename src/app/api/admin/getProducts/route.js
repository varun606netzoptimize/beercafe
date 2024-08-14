import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Fetch all products with their associated brands
    const products = await prisma.product.findMany({
      include: {
        Brand: true // Ensure the related Brand information is included
      }
    })

    // Send the products data as JSON response
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
