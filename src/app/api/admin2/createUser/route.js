import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req) {
  try {
    const { name, email, phone, password, userType, points } = await req.json()

    // Validate required fields based on user type
    if (!userType) {
      return new Response(JSON.stringify({ message: 'User type is required' }), { status: 400 })
    }

    if (userType === 'manager' || userType === 'owner' || userType === 'admin') {
      if (!name || !email || !password) {
        return new Response(JSON.stringify({ message: 'Name, email, and password are required' }), { status: 400 })
      }

      // Check if email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })

      if (existingUser) {
        return new Response(JSON.stringify({ message: 'Email already exists' }), { status: 400 })
      }

      // Determine role ID based on user type
      let roleId

      switch (userType) {
        case 'manager':
          roleId = '66ab602a353d40f4a7f8b439' // Replace with actual role ID for manager
          break
        case 'owner':
          roleId = '66ab602a353d40f4a7f8b438' // Replace with actual role ID for owner
          break
        case 'admin':
          roleId = '66ab602a353d40f4a7f8b437' // Replace with actual role ID for admin
          break
        default:
          return new Response(JSON.stringify({ message: 'Invalid user type' }), { status: 400 })
      }

      // Create manager, owner, or admin
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password,
          roleId,
          points: points ?? null // If points are not provided, default to null
        }
      })

      return new Response(
        JSON.stringify({
          message: `${userType.charAt(0).toUpperCase() + userType.slice(1)} created successfully`,
          user: newUser
        }),
        { status: 201 }
      )
    } else if (userType === 'user') {
      if (!name || !phone) {
        return new Response(JSON.stringify({ message: 'Name and phone are required' }), { status: 400 })
      }

      // Check if phone number already exists
      const existingUser = await prisma.user.findUnique({
        where: { phone }
      })

      if (existingUser) {
        return new Response(JSON.stringify({ message: 'Phone number already exists' }), { status: 400 })
      }

      // Create user
      const newUser = await prisma.user.create({
        data: {
          name,
          phone,
          points: points ?? null, // If points are not provided, default to null
          roleId: '66ab602a353d40f4a7f8b43a' // Replace with the actual role ID for user
        }
      })

      return new Response(JSON.stringify({ message: 'User created successfully', user: newUser }), { status: 201 })
    } else {
      return new Response(JSON.stringify({ message: 'Invalid user type' }), { status: 400 })
    }
  } catch (error) {
    console.error('Error creating user:', error)

    return new Response(JSON.stringify({ message: 'Error creating user' }), { status: 500 })
  }
}
