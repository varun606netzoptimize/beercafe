import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req, { params }) {
  const token = req.headers.get('Authorization')?.split(' ')[1] // Get the token from the Authorization header
  const { id } = params // Extract the manager ID from the URL parameters

  if (!token) {
    return new Response(JSON.stringify({ message: 'No token provided' }), { status: 401 })
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Check if the user role is Admin
    if (decoded.role !== 'Admin' && decoded.role !== 'Manager') {
      return new Response(JSON.stringify({ message: 'Not authorized' }), { status: 403 })
    }

    // Fetch manager details based on ID
    const manager = await prisma.manager.findUnique({
      where: { id: id },
      include: { cafe: true } // Optionally include related cafe details
    })

    if (!manager) {
      return new Response(JSON.stringify({ message: 'Manager not found' }), { status: 404 })
    }

    return new Response(JSON.stringify({ message: 'Token is valid', manager }), { status: 200 })
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return new Response(JSON.stringify({ message: 'Invalid token' }), { status: 401 })
    }

    console.error(err)

    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 })
  } finally {
    await prisma.$disconnect() // Ensure Prisma Client disconnects after the query
  }
}
