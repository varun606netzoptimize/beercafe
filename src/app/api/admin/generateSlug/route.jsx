// app/api/generateSlug/route.js

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req) {
  try {
    const { baseSlug } = await req.json()

    if (!baseSlug) {
      return new Response(JSON.stringify({ error: 'Base slug is required' }), { status: 400 })
    }

    let slug = baseSlug
    let uniqueSlug = slug
    let counter = 1

    while (true) {
      const existingCafe = await prisma.cafe.findUnique({
        where: { slug: uniqueSlug }
      })

      if (!existingCafe) {
        break
      }

      uniqueSlug = `${slug}-${counter}`
      counter++
    }

    return new Response(JSON.stringify({ slug: uniqueSlug }), { status: 200 })
  } catch (error) {
    console.error('Error generating slug:', error)

    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 })
  }
}
