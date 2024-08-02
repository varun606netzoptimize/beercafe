import { PrismaClient } from '@prisma/client'

import { verifyAdmin } from '../../utils/verifyAdmin' // Adjust the path as necessary

const prisma = new PrismaClient()

export async function PUT(req) {
  try {
    // Verify if the user making the request is an admin
    await verifyAdmin(req)

    const { id, name, email, phone, password, userType, points } = await req.json()

    // Validate required fields
    if (!id) {
      return new Response(JSON.stringify({ message: 'User ID is required' }), { status: 400 })
    }

    // Fetch the user to be updated
    const existingUser = await prisma.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 })
    }

    // Prepare the update data
    const updateData = {}

    if (name) updateData.name = name

    if (email) {
      // Check if email is already in use by another user
      const emailInUse = await prisma.user.findUnique({
        where: { email }
      })

      if (emailInUse && emailInUse.id !== id) {
        return new Response(JSON.stringify({ message: 'Email already in use' }), { status: 400 })
      }

      updateData.email = email
    }

    if (phone) {
      // Check if phone is already in use by another user
      const phoneInUse = await prisma.user.findUnique({
        where: { phone }
      })

      if (phoneInUse && phoneInUse.id !== id) {
        return new Response(JSON.stringify({ message: 'Phone number already in use' }), { status: 400 })
      }

      updateData.phone = phone
    }

    if (password) updateData.password = password

    if (userType) {
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
        case 'user':
          roleId = '66ab602a353d40f4a7f8b43a' // Replace with actual role ID for user
          break
        default:
          return new Response(JSON.stringify({ message: 'Invalid user type' }), { status: 400 })
      }

      updateData.roleId = roleId
    }

    if (points !== undefined) updateData.points = points

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData
    })

    return new Response(
      JSON.stringify({
        message: 'User updated successfully',
        user: updatedUser
      }),
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating user:')

    // Handle specific error responses
    if (error instanceof Response) {
      return error
    }

    // Handle unexpected errors
    return new Response(JSON.stringify({ message: 'Error updating user' }), { status: 500 })
  }
}
