import { PrismaClient } from '@prisma/client'

import { verifyAdmin } from '../../utils/verifyAdmin'

const prisma = new PrismaClient()

export async function DELETE(req) {
  try {
    // Extract Authorization header
    const authHeader = req.headers.get('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ message: 'Authorization header missing or invalid' }), { status: 401 })
    }

    const token = authHeader.split(' ')[1]

    // Verify the token
    try {
      verifyAdmin(token)
    } catch (err) {
      console.error('Token verification failed:', err)

      return new Response(JSON.stringify({ message: err.message }), { status: 401 })
    }

    // Extract user ID from request body
    const { id } = await req.json()

    if (!id) {
      return new Response(JSON.stringify({ message: 'User ID is required' }), { status: 400 })
    }

    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: { id }
    })

    if (!userExists) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 })
    }

    // Delete the user
    await prisma.user.delete({
      where: { id }
    })

    console.log('User deleted successfully:', id)

    return new Response(JSON.stringify({ message: 'User deleted successfully' }), { status: 200 })
  } catch (error) {
    console.error('Error deleting user:', error)

    return new Response(JSON.stringify({ message: 'Error deleting user' }), { status: 500 })
  }
}
