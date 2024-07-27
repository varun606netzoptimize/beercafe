import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export async function POST(req) {
  try {
    const { name, email, password } = await req.json()

    console.log('Received request data:', { name, email, password })

    // Check if essential data is provided
    if (!name || !email || !password) {
      console.log('Name, email, and password are required')

      return new Response(JSON.stringify({ message: 'Name, email, and password are required' }), { status: 400 })
    }

    // Check if admin exists by email
    const adminExists = await prisma.admin.findUnique({
      where: { email }
    })

    if (adminExists) {
      console.log('Admin already exists with email:', email)

      return new Response(JSON.stringify({ message: 'Admin already exists' }), { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new admin
    const newAdmin = await prisma.admin.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    })

    console.log('Admin created successfully:', newAdmin)

    return new Response(JSON.stringify({ message: 'Admin created successfully', adminData: newAdmin }), { status: 201 })
  } catch (error) {
    console.error('Error creating admin:', error)

    return new Response(JSON.stringify({ message: 'Error creating admin' }), { status: 500 })
  }
}
