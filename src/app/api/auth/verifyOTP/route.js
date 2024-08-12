import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken' // Ensure this is installed

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key' // Ensure you have a JWT secret

export async function POST(req) {
  try {
    const { phoneNumber, otp } = await req.json()

    if (!phoneNumber || !otp) {
      return new NextResponse(JSON.stringify({ message: 'Phone number and OTP are required' }), { status: 400 })
    }

    // Find the OTP record for the given phone number and OTP
    const otpRecord = await prisma.otp.findFirst({
      where: {
        phoneNumber,
        otp,
        verified: false,
        expiresAt: { gte: new Date() } // Ensure OTP is still valid
      }
    })

    if (!otpRecord) {
      return new NextResponse(JSON.stringify({ message: 'Invalid or expired OTP' }), { status: 400 })
    }

    // Mark the OTP as verified
    await prisma.otp.update({
      where: { id: otpRecord.id },
      data: { verified: true }
    })

    // Find the customer associated with the phone number
    const customer = await prisma.customer.findFirst({
      where: { phoneNumber }
    })

    if (!customer) {
      return new NextResponse(JSON.stringify({ message: 'Customer not found' }), { status: 404 })
    }

    // Create a JWT token for the customer
    const token = jwt.sign({ customerId: customer.id }, JWT_SECRET, { expiresIn: '1h' })

    // Return the response with customer details
    return new NextResponse(
      JSON.stringify({
        message: 'OTP verified successfully',
        token,
        customer: {
          id: customer.id,
          firstname: customer.firstname,
          lastname: customer.lastname,
          phoneNumber: customer.phoneNumber,
          points: customer.points
        }
      }),
      { status: 200 }
    )
  } catch (error) {
    console.error('Error verifying OTP:', error)

    return new NextResponse(JSON.stringify({ message: 'Server error' }), { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
