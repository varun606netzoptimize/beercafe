import { PrismaClient } from '@prisma/client'

import { verifyAdmin } from '../../utils/verifyAdmin'

const prisma = new PrismaClient()

import { runMiddleware } from '@/lib/cors'

export async function GET(req, res) {
  await runMiddleware(req, res, cors)

  const adminAuthResponse = await verifyAdmin(req)

  if (adminAuthResponse) return adminAuthResponse

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        points: true
      }
    })

    return new Response(JSON.stringify(users), { status: 200 })
  } catch (err) {
    console.error(err)

    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 })
  }
}
