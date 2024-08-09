import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function DELETE(req) {
  try {
    // Extract cafeId from the query parameters
    const url = new URL(req.url, `http://${req.headers.host}`)
    const cafeId = url.searchParams.get('cafeId')

    if (!cafeId) {
      return new NextResponse(JSON.stringify({ message: 'Cafe ID is required' }), { status: 400 })
    }

    // Find the cafe with its related children (assuming children is the correct field name)
    const cafe = await prisma.cafe.findUnique({
      where: { id: cafeId },
      include: { children: true } // Ensure 'children' is the correct relation name in your schema
    })

    if (!cafe) {
      return new NextResponse(JSON.stringify({ message: 'Cafe not found' }), { status: 404 })
    }

    // Delete associated CafeUser records for the main cafe
    await prisma.cafeUser.deleteMany({
      where: { cafeId: cafeId }
    })

    // Delete associated CafeUser records for all child cafes (branches)
    await prisma.cafeUser.deleteMany({
      where: {
        cafeId: {
          in: cafe.children.map(child => child.id)
        }
      }
    })

    // Delete all child cafes (branches) first
    await prisma.cafe.deleteMany({
      where: {
        parentId: cafeId
      }
    })

    // Then delete the main cafe
    await prisma.cafe.delete({
      where: { id: cafeId }
    })

    return new NextResponse(JSON.stringify({ message: 'Cafe and its branches deleted successfully' }), { status: 200 })
  } catch (error) {
    console.error('Error deleting cafe:', error)

    return new NextResponse(JSON.stringify({ message: 'Server error' }), { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
