import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req) {
  try {
    const rfids = await prisma.rFIDMaster.findMany({})
    return NextResponse.json(rfids)
  } catch (error) {
    console.error('Error fetching users:', error)

    return new NextResponse(JSON.stringify({ message: 'Server error' }), { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
