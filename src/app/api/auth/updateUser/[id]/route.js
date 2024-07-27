import jwt from 'jsonwebtoken'

import prisma from '@/lib/prisma'

// Export named handlers for HTTP methods
export async function PUT(req) {
  try {
    // Debugging: Check the URL and extracted ID
    const url = new URL(req.url, `http://${req.headers.host}`)

    console.log('Request URL:', url.pathname)

    const pathParts = url.pathname.split('/')
    const id = pathParts[pathParts.length - 1] // Extract ID from URL path

    console.log('Extracted ID:', id)

    const { name, email, phone, points } = await req.json()
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

    const updatedUser = await prisma.users.update({
      where: { id: id.toString() },
      data: { name, email, phone, points }
    })

    return new Response(JSON.stringify({ message: 'User updated successfully', user: updatedUser }), { status: 200 })
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return new Response(JSON.stringify({ message: 'Invalid token' }), { status: 401 })
    }

    if (err.code === 'P2025') {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 })
    }

    console.log(err)

    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 })
  }
}
