import { PrismaClient } from '@prisma/client'

import { verifyAdmin } from '../../utils/verifyAdmin'

const prisma = new PrismaClient()

import cors, { runMiddleware } from '@/lib/cors'

export async function POST(req, res) {
  // await runMiddleware(req, res, cors)

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

    const { name, email, phone, otp, points } = await req.json()

    console.log('Received request data:', { name, email, phone, otp, points })

    // Check if essential data is provided
    if (!name || !email) {
      console.log('Name and email are required')

      return new Response(JSON.stringify({ message: 'Name and email are required' }), { status: 400 })
    }

    // Check if user exists by email
    const userExists = await prisma.user.findUnique({
      where: { email }
    })

    if (userExists) {
      console.log('User already exists with email:', email)

      return new Response(JSON.stringify({ message: 'User already exists' }), { status: 400 })
    }

    // Check if phone number already exists
    if (phone) {
      const phoneExists = await prisma.user.findUnique({
        where: { phone }
      })

      if (phoneExists) {
        console.log('Phone number already exists:', phone)

        return new Response(JSON.stringify({ message: 'Phone number already exists' }), { status: 400 })
      }
    }

    // Construct user data with default points
    const userData = {
      name,
      email,
      phone: phone || null, // Ensure phone is null if not provided
      otp: otp || '', // Default OTP to empty string if not provided
      points: points || 0 // Default points to 0 if not provided
    }

    console.log('Constructed userData:', userData)

    // Create new user
    const newUser = await prisma.user.create({
      data: userData
    })

    console.log('User created successfully:', newUser)

    return new Response(JSON.stringify({ message: 'User created successfully', userData: newUser }), { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)

    return new Response(JSON.stringify({ message: 'Error creating user' }), { status: 500 })
  }
}
