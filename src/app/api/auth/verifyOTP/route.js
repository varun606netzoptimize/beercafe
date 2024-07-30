import jwt from 'jsonwebtoken'

import prisma from '@/lib/prisma'

export async function POST(req) {
  const { phone, otp } = await req.json()

  if (!phone || !otp) {
    return new Response(JSON.stringify({ message: 'Phone number and OTP are required' }), { status: 400 })
  }

  try {
    // Find user by phone number
    const user = await prisma.user.findUnique({ where: { phone } })

    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 })
    }

    // Check if OTP is valid
    if (user.otp !== otp) {
      return new Response(JSON.stringify({ message: 'Invalid OTP' }), { status: 400 })
    }

    // Clear OTP after successful verification
    await prisma.user.update({
      where: { phone },
      data: { otp: null }
    })

    // Create and assign a token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' })

    return new Response(JSON.stringify({ message: 'OTP verified successfully', token, user }), { status: 200 })
  } catch (err) {
    console.error(err)

    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 })
  }
}
