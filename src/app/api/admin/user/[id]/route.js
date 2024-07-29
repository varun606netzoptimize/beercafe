// src/app/api/auth/user/[id]/route.js
import { verifyAdmin } from '@/app/api/utils/verifyAdmin'
import prisma from '@/lib/prisma'

export async function GET(req, res) {
  const adminAuthResponse = await verifyAdmin(req)

  if (adminAuthResponse) return adminAuthResponse

  // Extract the ID from the URL path
  const { pathname } = req.nextUrl
  const pathParts = pathname.split('/')
  const id = pathParts[pathParts.length - 1] // Extract ID from URL path

  if (!id) {
    return new Response(JSON.stringify({ message: 'User ID is required' }), { status: 400 })
  }

  try {
    // Fetch the user by ID
    const user = await prisma.user.findUnique({ where: { id } })

    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 })
    }

    if (user.role !== 'User' && user.role !== 'Manager') {
      return new Response(JSON.stringify({ message: 'User or Manager not found' }), { status: 404 })
    }

    return new Response(JSON.stringify(user), { status: 200 })
  } catch (err) {
    console.error(err)

    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 })
  }
}
