import { PrismaClient } from '@prisma/client'

import { verifyAdmin } from '../../utils/verifyAdmin'

const prisma = new PrismaClient()

import { runMiddleware } from '@/lib/cors'

export async function DELETE(req, res) {
  await runMiddleware(req, res, cors)

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

    // Extract manager ID from request body
    const { id } = await req.json()

    if (!id) {
      return new Response(JSON.stringify({ message: 'Manager ID is required' }), { status: 400 })
    }

    // Check if manager exists
    const managerExists = await prisma.manager.findUnique({
      where: { id }
    })

    if (!managerExists) {
      return new Response(JSON.stringify({ message: 'Manager not found' }), { status: 404 })
    }

    // Delete the manager
    await prisma.manager.delete({
      where: { id }
    })

    console.log('Manager deleted successfully:', id)

    return new Response(JSON.stringify({ message: 'Manager deleted successfully' }), { status: 200 })
  } catch (error) {
    console.error('Error deleting manager:', error)

    return new Response(JSON.stringify({ message: 'Error deleting manager' }), { status: 500 })
  }
}
