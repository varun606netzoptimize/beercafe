import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

import cors, { runMiddleware } from '@/lib/cors'

export async function PUT(req, res) {
  // await runMiddleware(req, res, cors)

  try {
    const { id, name, email, phone, password, cafeId } = await req.json()

    console.log('Received request data:', { id, name, email, phone, password, cafeId })

    // Check if the ID is provided
    if (!id) {
      console.log('Manager ID is required')

      return new Response(JSON.stringify({ message: 'Manager ID is required' }), { status: 400 })
    }

    // Check if essential data is provided for updating
    if (!name && !email && !phone && !password && !cafeId) {
      console.log('At least one field is required for update')

      return new Response(JSON.stringify({ message: 'At least one field is required for update' }), { status: 400 })
    }

    // Find the existing manager
    const existingManager = await prisma.manager.findUnique({ where: { id } })

    if (!existingManager) {
      console.log('Manager not found with id:', id)

      return new Response(JSON.stringify({ message: 'Manager not found' }), { status: 404 })
    }

    // Check if the new email exists in users, admins, or managers tables
    if (email && email !== existingManager.email) {
      const existingManagerByEmail = await prisma.manager.findUnique({ where: { email } })
      const existingUserByEmail = await prisma.user.findUnique({ where: { email } })
      const existingAdminByEmail = await prisma.admin.findUnique({ where: { email } })

      if (existingManagerByEmail || existingUserByEmail || existingAdminByEmail) {
        console.log('Email already exists:', email)

        return new Response(JSON.stringify({ message: 'Email already exists' }), { status: 400 })
      }
    }

    // Check if the new phone exists in users or managers tables
    if (phone && phone !== existingManager.phone) {
      const existingManagerByPhone = await prisma.manager.findUnique({ where: { phone } })
      const existingUserByPhone = await prisma.user.findUnique({ where: { phone } })

      if (existingManagerByPhone || existingUserByPhone) {
        console.log('Phone number already exists:', phone)

        return new Response(JSON.stringify({ message: 'Phone number already exists' }), { status: 400 })
      }
    }

    // Hash the new password if provided
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined

    // Update the manager
    const updatedManager = await prisma.manager.update({
      where: { id },
      data: {
        name: name || existingManager.name,
        email: email || existingManager.email,
        phone: phone || existingManager.phone,
        password: hashedPassword || existingManager.password,
        cafeId: cafeId || existingManager.cafeId
      }
    })

    console.log('Manager updated successfully:', updatedManager)

    // Update the cafe if needed
    if (cafeId) {
      const cafeExists = await prisma.cafe.findUnique({ where: { id: cafeId } })

      if (!cafeExists) {
        console.log('Cafe does not exist with id:', cafeId)

        return new Response(JSON.stringify({ message: 'Cafe does not exist' }), { status: 400 })
      }

      await prisma.cafe.update({
        where: { id: cafeId },
        data: {
          managers: {
            connect: { id: updatedManager.id }
          }
        }
      })
    }

    return new Response(
      JSON.stringify({
        message: 'Manager updated successfully',
        managerData: updatedManager
      }),
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating manager:', error)

    return new Response(JSON.stringify({ message: 'Error updating manager' }), { status: 500 })
  }
}
