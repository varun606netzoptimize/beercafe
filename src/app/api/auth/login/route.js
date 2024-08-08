import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key' // Replace with your actual secret key

export async function POST(req) {
  try {
    // Parse request body
    const { email, password } = await req.json()

    // Validate input
    if (!email || !password) {
      return new Response(JSON.stringify({ message: 'Email and password are required' }), { status: 400 })
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: { userType: true } // Include userType to access role
    })

    if (!user) {
      return new Response(JSON.stringify({ message: 'Invalid email or password' }), { status: 401 })
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return new Response(JSON.stringify({ message: 'Invalid email or password' }), { status: 401 })
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.userType.type // Assuming role type is stored in userType
      },
      SECRET_KEY,
      { expiresIn: '1h' } // Set token expiration
    )

    return new Response(
      JSON.stringify({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.userType.type // Assuming role type is stored in userType
        }
      }),
      { status: 200 }
    )
  } catch (error) {
    console.error('Error during login:', error)

    return new Response(JSON.stringify({ message: 'Error during login' }), { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
