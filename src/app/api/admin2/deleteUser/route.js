import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'

import { verifyAdmin } from '../../utils/verifyAdmin'

const prisma = new PrismaClient()

export async function DELETE(req) {
  try {
    // Verify admin authorization
    const adminAuthResponse = await verifyAdmin(req)

    if (adminAuthResponse) return adminAuthResponse

    // Extract user ID from the request URL
    const url = new URL(req.url, `http://${req.headers.host}`)
    const userId = url.searchParams.get('id')

    if (!userId) {
      return new NextResponse(JSON.stringify({ message: 'User ID is required' }), { status: 400 })
    }

    // Delete the user with the specified ID
    await prisma.user.delete({
      where: {
        id: userId
      }
    })

    // Return response indicating successful deletion
    return new NextResponse(JSON.stringify({ message: 'User deleted successfully' }), { status: 200 })
  } catch (error) {
    console.error('Error deleting user:', error)

    return new NextResponse(JSON.stringify({ message: 'Server error' }), { status: 500 })
  }
}
