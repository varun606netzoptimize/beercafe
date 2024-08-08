import { PrismaClient } from '@prisma/client'

import { verifyAdmin } from '../../utils/verifyAdmin'

const prisma = new PrismaClient()

export async function DELETE(req) {
  // Verify if the request is made by an admin
  const authResponse = await verifyAdmin(req)

  if (authResponse) return authResponse

  try {
    // Extract the user ID from query parameters
    const url = new URL(req.url)
    const id = url.searchParams.get('id')

    // Validate required fields
    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing user ID' }), { status: 400 })
    }

    // Check if the user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 })
    }

    // Delete user-cafe relationships first
    await prisma.cafeUser.deleteMany({
      where: { userId: id }
    })

    // Delete the user
    await prisma.user.delete({
      where: { id }
    })

    return new Response(JSON.stringify({ message: 'User deleted successfully' }), { status: 200 })
  } catch (error) {
    console.error('Error deleting user:', error)

    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
