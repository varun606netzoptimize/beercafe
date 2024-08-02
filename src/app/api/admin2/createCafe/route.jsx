import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'

import { verifyAdmin } from '../../utils/verifyAdmin'

const prisma = new PrismaClient()

export async function POST(req) {
  try {
    // Verify if the user is an admin
    const adminAuthResponse = await verifyAdmin(req)

    if (adminAuthResponse) return adminAuthResponse

    // Extract data from the request body
    const { name, location, ownerId, managerId, parentId } = await req.json()

    // Validate required fields
    if (!name || !location) {
      return new NextResponse(JSON.stringify({ message: 'Name and location are required' }), { status: 400 })
    }

    // Check for either ownerId or parentId
    if (!ownerId && !parentId) {
      return new NextResponse(JSON.stringify({ message: 'Either ownerId or parentId is required' }), { status: 400 })
    }

    // Check that ownerId and parentId are valid formats if provided
    if (ownerId && !/^[a-fA-F0-9]{24}$/.test(ownerId)) {
      return new NextResponse(JSON.stringify({ message: 'Invalid ownerId format' }), { status: 400 })
    }

    if (parentId && !/^[a-fA-F0-9]{24}$/.test(parentId)) {
      return new NextResponse(JSON.stringify({ message: 'Invalid parentId format' }), { status: 400 })
    }

    // Ensure that if ownerId is provided, parentId must be null or undefined
    if (ownerId && parentId) {
      return new NextResponse(JSON.stringify({ message: 'If ownerId is provided, parentId should not be provided' }), {
        status: 400
      })
    }

    let ownerIdToUse = ownerId

    // If parentId is provided, fetch the parent cafe to get its owner
    if (parentId) {
      const parentCafe = await prisma.cafe.findUnique({
        where: { id: parentId },
        select: { ownerId: true }
      })

      if (!parentCafe) {
        return new NextResponse(JSON.stringify({ message: 'Parent cafe not found' }), { status: 404 })
      }

      // Use the parent cafe's ownerId if ownerId is not provided
      ownerIdToUse = parentCafe.ownerId
    }

    // Handle manager reassignment
    if (managerId) {
      // Find the current cafe associated with the manager
      const existingManagerCafe = await prisma.cafe.findFirst({
        where: {
          managerId
        }
      })

      // If the manager is already associated with a cafe, remove them from that cafe
      if (existingManagerCafe) {
        await prisma.cafe.update({
          where: { id: existingManagerCafe.id },
          data: {
            managerId: null
          }
        })
      }
    }

    // Create the new cafe
    const newCafe = await prisma.cafe.create({
      data: {
        name,
        location,
        ownerId: ownerIdToUse || null,
        managerId,
        parentId
      }
    })

    return new NextResponse(JSON.stringify({ message: 'Cafe created successfully', cafe: newCafe }), { status: 201 })
  } catch (error) {
    console.error('Error creating cafe:', error)

    return new NextResponse(JSON.stringify({ message: 'Error creating cafe' }), { status: 500 })
  }
}
