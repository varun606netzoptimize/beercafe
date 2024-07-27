import jwt from 'jsonwebtoken'

import prisma from '@/lib/prisma'

// Export named handlers for HTTP methods
export async function DELETE(req) {
  try {
    // Debugging: Check the URL and extracted ID
    const url = new URL(req.url, `http://${req.headers.host}`)

    console.log('Request URL:', url.pathname)

    const pathParts = url.pathname.split('/')
    const id = pathParts[pathParts.length - 1] // Extract ID from URL path

    const token = req.headers.get('authorization')?.split(' ')[1]

    if (!token) {
      return new Response(JSON.stringify({ message: 'No token provided' }), { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (decoded.role !== 'Admin') {
      return new Response(JSON.stringify({ message: 'Access denied' }), { status: 403 })
    }

    if (!id) {
      return new Response(JSON.stringify({ message: 'User ID is required' }), { status: 400 })
    }

    const user = await prisma.users.findUnique({ where: { id: id.toString() } })

    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 })
    }

    await prisma.users.delete({
      where: { id: id.toString() }
    })

    return new Response(JSON.stringify({ message: 'User deleted successfully' }), { status: 200 })
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return new Response(JSON.stringify({ message: 'Invalid token' }), { status: 401 })
    }

    console.log(err)

    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 })
  }
}
