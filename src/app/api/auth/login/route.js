import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import prisma from '@/lib/prisma'

export async function POST(req) {
  try {
    const { email, password } = await req.json()

    // Find the user by email
    const user = await prisma.users.findUnique({
      where: { email }
    })

    // Check if user exists and has a valid role
    if (!user || (user.role !== 'Admin' && user.role !== 'Manager')) {
      return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 })
    }

    // Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 })
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' })

    // Return the response with token and user details
    return new Response(JSON.stringify({ token, email: user.email, role: user.role }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error(error)

    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 })
  }
}
