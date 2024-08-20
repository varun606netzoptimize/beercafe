import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Fetch all brands with their associated products
    const brands = await prisma.brands.findMany({
      include: {
        Product: true // Ensure this matches the relation in your Prisma schema
      }
    })

    // Send the brands data as JSON response
    return NextResponse.json(brands)
  } catch (error) {
    console.error('Error fetching brands:', error)

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
