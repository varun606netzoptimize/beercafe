import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

import { verifyAdmin } from '../../utils/verifyAdmin'

const prisma = new PrismaClient()
const saltRounds = 10 // Number of rounds for bcrypt hashing

export async function POST(req) {
  // Verify if the request is made by an admin
  // const authResponse = await verifyAdmin(req)

  // if (authResponse) return authResponse

  try {
    // Parse the request body
    const body = await req.json()
    const { name, email, phoneNumber, password, userTypeId, cafeIds } = body

    // Validate required fields
    if (!name || !email || !password || !userTypeId) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 })
    }

    // Check if the userTypeId exists
    const userType = await prisma.userType.findUnique({
      where: { id: userTypeId }
    })

    if (!userType) {
      return new Response(JSON.stringify({ error: 'Invalid userTypeId' }), { status: 400 })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create the new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phoneNumber,
        password: hashedPassword, // Store the hashed password
        userTypeId // Use the provided userTypeId
      }
    })

    // If cafeIds are provided, create relationships in CafeUser
    if (cafeIds && cafeIds.length > 0) {
      // Check existing relationships
      const existingCafeUsers = await prisma.cafeUser.findMany({
        where: {
          userId: newUser.id,
          cafeId: { in: cafeIds }
        }
      })

      const existingCafeUserIds = new Set(existingCafeUsers.map(cu => cu.cafeId))

      // Determine which new CafeUser records need to be created
      const newCafeUserRelations = cafeIds
        .filter(cafeId => !existingCafeUserIds.has(cafeId))
        .map(cafeId => ({
          cafeId,
          userId: newUser.id
        }))

      // Create the new CafeUser entries if there are any
      if (newCafeUserRelations.length > 0) {
        await Promise.all(
          newCafeUserRelations.map(async relation => {
            await prisma.cafeUser.create({
              data: relation
            })
          })
        )
      }
    }

    return new Response(JSON.stringify(newUser), { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)

    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
