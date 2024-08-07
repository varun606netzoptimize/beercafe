import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const SECRET_KEY = process.env.JWT_SECRET // Replace with your actual secret key
const ADMIN_ROLE_ID = '66b3583586109427057d989f' // Replace with actual role ID for admin

export async function verifyAdmin(req) {
  try {
    // Extract the token from the request headers
    const authHeader = req.headers.get('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new NextResponse(JSON.stringify({ message: 'Unauthorized: Token missing or malformed' }), { status: 403 })
    }

    const token = authHeader.split(' ')[1] // Remove "Bearer " from the token

    // Decode and verify the token
    let decoded

    try {
      decoded = jwt.verify(token, SECRET_KEY)
    } catch (err) {
      return new NextResponse(JSON.stringify({ message: 'Unauthorized: Token verification failed' }), { status: 403 })
    }

    // Fetch the user associated with the token
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }, // Ensure `id` exists in token payload
      include: { userType: true } // Adjust if `userType` is managed differently
    })

    if (!user) {
      return new NextResponse(JSON.stringify({ message: 'Unauthorized: User not found' }), { status: 403 })
    }

    // Check if the user's role matches the admin role ID
    if (user.userType.id !== ADMIN_ROLE_ID) {
      // Ensure `userType` is included correctly
      return new NextResponse(JSON.stringify({ message: 'Unauthorized: User is not an admin' }), { status: 403 })
    }

    return null // Continue to the route handler if the admin is verified
  } catch (error) {
    console.error('Error verifying admin:', error)

    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 403 })
  } finally {
    await prisma.$disconnect() // Ensure to disconnect the client
  }
}
