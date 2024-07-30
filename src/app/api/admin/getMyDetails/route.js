import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req) {
  const token = req.headers.get('Authorization')?.split(' ')[1] // Get the token from the Authorization header

  if (!token) {
    return new Response(JSON.stringify({ message: 'No token provided' }), { status: 401 })
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Check if the token role is Admin or Manager
    if (decoded.role !== 'Admin' && decoded.role !== 'Manager') {
      return new Response(JSON.stringify({ message: 'Not authorized' }), { status: 403 })
    }

    // Fetch the user (manager) details based on email or ID from the token
    const user = await prisma.manager.findUnique({
      where: { id: decoded.id }, // Assuming email is used as a unique identifier
      include: { cafe: true } // Include related cafe details
    })

    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 })
    }

    return new Response(JSON.stringify({ message: 'Token is valid', user }), { status: 200 })
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
