// /api/customers/create.js
import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req) {
  try {
    const { firstname, lastname, phoneNumber, points } = await req.json()

    // Validate input
    if (!firstname || !lastname || !phoneNumber) {
      return new NextResponse(JSON.stringify({ message: 'Firstname, lastname, and phoneNumber are required' }), {
        status: 400
      })
    }

    // Create the customer
    const newCustomer = await prisma.customer.create({
      data: {
        firstname,
        lastname,
        phoneNumber,
        points
      }
    })

    return new NextResponse(JSON.stringify({ message: 'Customer created successfully', customer: newCustomer }), {
      status: 201
    })
  } catch (error) {
    console.error('Error creating customer:', error)

    return new NextResponse(JSON.stringify({ message: 'Server error' }), { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
