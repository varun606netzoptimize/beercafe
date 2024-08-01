import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key' // Replace with your actual secret key

export async function POST(req) {
  try {
    const { email, password } = await req.json()

    // Validate input
    if (!email || !password) {
      return new NextResponse(JSON.stringify({ message: 'Email and password are required' }), { status: 400 })
    }

    // Find user by email with role
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        role: true // Include the role relation
      }
    })

    if (!user) {
      return new NextResponse(JSON.stringify({ message: 'Invalid email or password' }), { status: 401 })
    }

    // Check if password matches (for demo purposes, replace with actual password verification logic)
    // For real-world applications, use bcrypt or similar library for password hashing and comparison
    if (user.password !== password) {
      return new NextResponse(JSON.stringify({ message: 'Invalid email or password' }), { status: 401 })
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        role: user.role.role // Now role should be correctly populated
      },
      SECRET_KEY,
      { expiresIn: '1h' } // Set token expiration
    )

    return new NextResponse(
      JSON.stringify({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role.role
        }
      }),
      { status: 200 }
    )
  } catch (error) {
    console.error('Error during login:', error)

    return new NextResponse(JSON.stringify({ message: 'Error during login' }), { status: 500 })
  }
}
