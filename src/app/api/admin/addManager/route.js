import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

import cors, { runMiddleware } from '@/lib/cors'

export async function POST(req, res) {
  // await runMiddleware(req, res, cors)

  try {
    const { name, email, phone, password, cafeId } = await req.json()

    console.log('Received request data:', { name, email, phone, password, cafeId })

    // Check if essential data is provided
    if (!name || !email || !password || !cafeId) {
      console.log('Name, email, password, and cafeId are required')

      return new Response(JSON.stringify({ message: 'Name, email, password, and cafeId are required' }), {
        status: 400
      })
    }

    // Check if the email or phone exists in either the users or managers tables
    const existingManager = await prisma.manager.findUnique({ where: { email } })
    const existingUser = await prisma.user.findUnique({ where: { email } })

    if (existingManager || existingUser) {
      console.log('Email already exists:', email)

      return new Response(JSON.stringify({ message: 'Email already exists' }), { status: 400 })
    }

    const existingPhoneManager = await prisma.manager.findUnique({ where: { phone } })
    const existingPhoneUser = await prisma.user.findUnique({ where: { phone } })

    if (existingPhoneManager || existingPhoneUser) {
      console.log('Phone number already exists:', phone)

      return new Response(JSON.stringify({ message: 'Phone number already exists' }), { status: 400 })
    }

    // Check if the cafe exists
    const cafeExists = await prisma.cafe.findUnique({ where: { id: cafeId } })

    if (!cafeExists) {
      console.log('Cafe does not exist with id:', cafeId)

      return new Response(JSON.stringify({ message: 'Cafe does not exist' }), { status: 400 })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new manager
    const newManager = await prisma.manager.create({
      data: {
        name,
        email,
        phone: phone || null,
        password: hashedPassword,
        cafeId
      }
    })

    console.log('Manager created successfully:', newManager)

    // Update the cafe to include the new manager
    const updatedCafe = await prisma.cafe.update({
      where: { id: cafeId },
      data: {
        managers: {
          connect: { id: newManager.id }
        }
      },
      include: { managers: true } // Include managers to see the update
    })

    console.log('Updated Cafe:', updatedCafe)

    return new Response(
      JSON.stringify({
        message: 'Manager created and cafe updated successfully',
        managerData: newManager,
        updatedCafe
      }),
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating manager:', error)

    return new Response(JSON.stringify({ message: 'Error creating manager' }), { status: 500 })
  }
}
