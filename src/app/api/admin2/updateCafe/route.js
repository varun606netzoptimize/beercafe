import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'

import { verifyAdmin } from '../../utils/verifyAdmin'

const prisma = new PrismaClient()

export async function PUT(req) {
  try {
    // Verify if the user is an admin
    const adminAuthResponse = await verifyAdmin(req)

    if (adminAuthResponse) return adminAuthResponse

    // Extract data from the request body
    const { id, name, location, ownerId, managerId, parentId } = await req.json()

    // Validate required fields
    if (!id) {
      return new NextResponse(JSON.stringify({ message: 'Cafe ID is required' }), { status: 400 })
    }

    // Check for either ownerId or parentId
    if (ownerId && parentId) {
      return new NextResponse(JSON.stringify({ message: 'Either ownerId or parentId is required' }), { status: 400 })
    }

    // Validate id, ownerId, and parentId formats if provided
    if (id && !/^[a-fA-F0-9]{24}$/.test(id)) {
      return new NextResponse(JSON.stringify({ message: 'Invalid cafe ID format' }), { status: 400 })
    }

    if (ownerId && !/^[a-fA-F0-9]{24}$/.test(ownerId)) {
      return new NextResponse(JSON.stringify({ message: 'Invalid ownerId format' }), { status: 400 })
    }

    if (parentId && !/^[a-fA-F0-9]{24}$/.test(parentId)) {
      return new NextResponse(JSON.stringify({ message: 'Invalid parentId format' }), { status: 400 })
    }

    // Ensure the cafe exists
    const existingCafe = await prisma.cafe.findUnique({
      where: { id }
    })

    if (!existingCafe) {
      return new NextResponse(JSON.stringify({ message: 'Cafe not found' }), { status: 404 })
    }

    let ownerIdToUse = ownerId || existingCafe.ownerId

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

    // Update the cafe
    const updatedCafe = await prisma.cafe.update({
      where: { id },
      data: {
        name: name || existingCafe.name,
        location: location || existingCafe.location,
        ownerId: ownerIdToUse,
        managerId,
        parentId: parentId || existingCafe.parentId
      }
    })

    return new NextResponse(JSON.stringify({ message: 'Cafe updated successfully', cafe: updatedCafe }), {
      status: 200
    })
  } catch (error) {
    console.error('Error updating cafe:', error)

    return new NextResponse(JSON.stringify({ message: 'Error updating cafe' }), { status: 500 })
  }
}
