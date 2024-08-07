import { sendOTP } from '../../utils/sendOTP'

import { generateOTP } from '../../utils/generateOTP'
import prisma from '@/lib/prisma'

export async function POST(req, res) {
  const { phone } = await req.json()

  // Validate phone number
  if (!phone) {
    return new Response(JSON.stringify({ message: 'Phone number is required' }), { status: 400 })
  }

  try {
    // Check if the user exists
    let user = await prisma.user.findUnique({ where: { phone } })

    const otp = generateOTP()

    // If user does not exist, create a new user
    if (!user) {
      user = await prisma.user.create({
        data: {
          phone,
          name: '',
          email: '',
          role: 'User',
          otp
        }
      })
    } else {
      // Update OTP for existing user
      await prisma.user.update({
        where: { phone },
        data: { otp }
      })
    }

    // Send OTP to user's phone and capture the result
    const sendOtpResult = await sendOTP(phone, otp)

    return new Response(
      JSON.stringify({ message: 'OTP sent to phone number', phone: user.phone, otp, sendOtpResult }),
      { status: 200 }
    )
  } catch (err) {
    console.error(err)

    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 })
  }
}