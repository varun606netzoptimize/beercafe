import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

import { verifyAdmin } from '../../utils/verifyAdmin'

const prisma = new PrismaClient()
const saltRounds = 10 // Number of rounds for bcrypt hashing

export async function PUT(req) {
  // Verify if the request is made by an admin
  const authResponse = await verifyAdmin(req)

  if (authResponse) return authResponse

  try {
    // Parse the request body
    const body = await req.json()
    const { id, name, email, phoneNumber, password, userTypeId, cafeIds } = body

    // Validate required fields
    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing user ID' }), { status: 400 })
    }

    // Check if the user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 })
    }

    // Prepare the update data
    const updateData = {
      ...(name && { name }),
      ...(email && { email }),
      ...(phoneNumber && { phoneNumber }),
      ...(password && { password: await bcrypt.hash(password, saltRounds) }), // Hash the new password
      ...(userTypeId && { userTypeId })
    }

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData
    })

    // If cafeIds are provided, update CafeUser relationships
    if (cafeIds && cafeIds.length > 0) {
      // Find existing relationships
      const existingCafeUsers = await prisma.cafeUser.findMany({
        where: {
          userId: id,
          cafeId: { in: cafeIds }
        }
      })

      const existingCafeUserIds = new Set(existingCafeUsers.map(cu => cu.cafeId))

      // Determine which new CafeUser records need to be created
      const newCafeUserRelations = cafeIds
        .filter(cafeId => !existingCafeUserIds.has(cafeId))
        .map(cafeId => ({
          cafeId,
          userId: id
        }))

      // Determine which old CafeUser records need to be deleted
      const cafeUserIdsToDelete = existingCafeUsers.filter(cu => !cafeIds.includes(cu.cafeId)).map(cu => cu.id)

      // Create new CafeUser entries if there are any
      if (newCafeUserRelations.length > 0) {
        await Promise.all(
          newCafeUserRelations.map(async relation => {
            await prisma.cafeUser.create({
              data: relation
            })
          })
        )
      }

      // Delete old CafeUser entries if there are any
      if (cafeUserIdsToDelete.length > 0) {
        await prisma.cafeUser.deleteMany({
          where: {
            id: { in: cafeUserIdsToDelete }
          }
        })
      }
    }

    return new Response(JSON.stringify(updatedUser), { status: 200 })
  } catch (error) {
    console.error('Error updating user:', error)

    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
