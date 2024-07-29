import { PrismaClient } from '@prisma/client'

import { verifyAdmin } from '../../utils/verifyAdmin'

const prisma = new PrismaClient()

import { runMiddleware } from '@/lib/cors'

export async function PUT(req, res) {
  await runMiddleware(req, res, cors)

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

    // Extract user data from request body
    const { id, name, email, phone, points } = await req.json()

    if (!id) {
      return new Response(JSON.stringify({ message: 'User ID is required' }), { status: 400 })
    }

    // Find the existing user
    const existingUser = await prisma.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 })
    }

    // Define a function to check email or phone existence across users, managers, and admins
    const isEmailOrPhoneTaken = async (emailToCheck, phoneToCheck) => {
      const userExists = emailToCheck ? await prisma.user.findUnique({ where: { email: emailToCheck } }) : null
      const managerExists = emailToCheck ? await prisma.manager.findUnique({ where: { email: emailToCheck } }) : null
      const adminExists = emailToCheck ? await prisma.admin.findUnique({ where: { email: emailToCheck } }) : null
      const phoneExists = phoneToCheck ? await prisma.user.findUnique({ where: { phone: phoneToCheck } }) : null

      return userExists || managerExists || adminExists || phoneExists
    }

    // Check if new email or phone is being used by another user, manager, or admin
    if (email && email !== existingUser.email) {
      const emailTaken = await isEmailOrPhoneTaken(email, null)

      if (emailTaken) {
        return new Response(JSON.stringify({ message: 'Email is already in use by another user, manager, or admin' }), {
          status: 400
        })
      }
    }

    if (phone && phone !== existingUser.phone) {
      const phoneTaken = await isEmailOrPhoneTaken(null, phone)

      if (phoneTaken) {
        return new Response(
          JSON.stringify({ message: 'Phone number is already in use by another user, manager, or admin' }),
          { status: 400 }
        )
      }
    }

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: name || existingUser.name,
        email: email || existingUser.email,
        phone: phone || existingUser.phone,
        points: points || existingUser.points
      }
    })

    console.log('User updated successfully:', updatedUser)

    return new Response(JSON.stringify({ message: 'User updated successfully', user: updatedUser }), { status: 200 })
  } catch (error) {
    console.error('Error updating user:', error)

    return new Response(JSON.stringify({ message: 'Error updating user' }), { status: 500 })
  }
}
