import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req, { params }) {
  try {
    const { cafeId } = params

    if (!cafeId) {
      return new NextResponse(JSON.stringify({ message: 'Café ID is required' }), { status: 400 })
    }

    // Find the customers associated with the café
    const cafeCustomers = await prisma.cafeCustomers.findMany({
      where: { cafeId },
      include: { Customer: true } // Include customer details
    })

    // Map to get only the customer details
    const customers = cafeCustomers.map(cafeCustomer => ({
      id: cafeCustomer.Customer.id,
      firstname: cafeCustomer.Customer.firstname,
      lastname: cafeCustomer.Customer.lastname,
      phoneNumber: cafeCustomer.Customer.phoneNumber,
      points: cafeCustomer.Customer.points
    }))

    return new NextResponse(JSON.stringify({ customers }), { status: 200 })
  } catch (error) {
    console.error('Error fetching customers:', error)

    return new NextResponse(JSON.stringify({ message: 'Server error' }), { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
