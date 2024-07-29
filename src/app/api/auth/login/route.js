import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req) {
  try {
    const { email, password } = await req.json()

    // Find the user by email in both Manager and Admin tables
    const manager = await prisma.manager.findUnique({
      where: { email }
    })

    const admin = await prisma.admin.findUnique({
      where: { email }
    })

    const user = manager || admin
    const role = manager ? 'Manager' : 'Admin'

    // Check if user exists
    if (!user) {
      return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 })
    }

    // Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 })
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, role }, process.env.JWT_SECRET, { expiresIn: '1h' })

    // Return the response with token and user details
    return new Response(JSON.stringify({ token, email: user.email, role }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error(error)

    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 })
  }
}
