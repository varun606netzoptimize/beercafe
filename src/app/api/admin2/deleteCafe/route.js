import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'

import { verifyAdmin } from '../../utils/verifyAdmin'

const prisma = new PrismaClient()

export async function DELETE(req) {
  try {
    // Verify if the user is an admin
    const adminAuthResponse = await verifyAdmin(req)

    if (adminAuthResponse) return adminAuthResponse

    // Extract cafe ID from the query parameters
    const url = new URL(req.url, `http://${req.headers.host}`)
    const cafeId = url.searchParams.get('id')

    // Validate cafe ID format
    if (!cafeId || !/^[a-fA-F0-9]{24}$/.test(cafeId)) {
      return new NextResponse(JSON.stringify({ message: 'Invalid cafe ID format' }), { status: 400 })
    }

    // Check if the cafe exists
    const cafeToDelete = await prisma.cafe.findUnique({
      where: { id: cafeId }
    })

    if (!cafeToDelete) {
      return new NextResponse(JSON.stringify({ message: 'Cafe not found' }), { status: 404 })
    }

    // Delete all cafes that have the current cafe as their parentId
    await prisma.cafe.deleteMany({
      where: { parentId: cafeId }
    })

    // Delete the cafe itself
    await prisma.cafe.delete({
      where: { id: cafeId }
    })

    return new NextResponse(JSON.stringify({ message: 'Cafe and its children deleted successfully' }), { status: 200 })
  } catch (error) {
    console.error('Error deleting cafe:', error)

    return new NextResponse(JSON.stringify({ message: 'Error deleting cafe' }), { status: 500 })
  }
}
