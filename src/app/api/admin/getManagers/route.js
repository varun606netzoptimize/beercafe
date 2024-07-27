// src/app/api/auth/getManagers/route.js
import { verifyAdmin } from '../../utils/verifyAdmin'
import prisma from '@/lib/prisma'

export async function GET(req) {
  const adminAuthResponse = await verifyAdmin(req)

  if (adminAuthResponse) return adminAuthResponse

  try {
    const managers = await prisma.users.findMany({ where: { role: 'Manager' } })

    return new Response(JSON.stringify(managers), { status: 200 })
  } catch (err) {
    console.error(err)

    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 })
  }
}
