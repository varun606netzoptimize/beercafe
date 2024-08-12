import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'
import otpGenerator from 'otp-generator'

const prisma = new PrismaClient()

export async function POST(req) {
  try {
    const { phoneNumber } = await req.json()

    if (!phoneNumber) {
      return new NextResponse(JSON.stringify({ message: 'Phone number is required' }), { status: 400 })
    }

    // Generate a new OTP
    const otp = otpGenerator.generate(6, { digits: true, upperCase: true, specialChars: false })

    // Check if OTP already exists for the phone number and is not expired
    const existingOtp = await prisma.otp.findFirst({
      where: {
        phoneNumber,
        verified: false,
        expiresAt: { gte: new Date() } // Check if OTP is still valid
      }
    })

    if (existingOtp) {
      // Update the existing OTP record
      await prisma.otp.update({
        where: { id: existingOtp.id },
        data: {
          otp,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000), // OTP valid for 15 minutes
          verified: false // Initially set to false
        }
      })
    } else {
      // Create a new OTP record
      await prisma.otp.create({
        data: {
          phoneNumber,
          otp,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000), // OTP valid for 15 minutes
          verified: false // Initially set to false
        }
      })
    }

    return new NextResponse(JSON.stringify({ message: 'OTP generated successfully', otp }), { status: 200 })
  } catch (error) {
    console.error('Error generating OTP:', error)

    return new NextResponse(JSON.stringify({ message: 'Server error' }), { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
