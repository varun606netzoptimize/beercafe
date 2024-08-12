// /api/customers/update.js
import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PUT(req) {
  try {
    const { id, firstname, lastname, phoneNumber, points } = await req.json()

    // Validate input
    if (!id || !firstname || !lastname || !phoneNumber) {
      return new NextResponse(JSON.stringify({ message: 'ID, firstname, lastname, and phoneNumber are required' }), {
        status: 400
      })
    }

    // Update the customer
    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: {
        firstname,
        lastname,
        phoneNumber,
        points
      }
    })

    return new NextResponse(JSON.stringify({ message: 'Customer updated successfully', customer: updatedCustomer }), {
      status: 200
    })
  } catch (error) {
    console.error('Error updating customer:', error)

    return new NextResponse(JSON.stringify({ message: 'Server error' }), { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
