import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Function to handle POST requests
export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json()
    const { name, description, logo } = body

    // Create a new brand in the database
    const newBrand = await prisma.brands.create({
      data: {
        name,
        description,
        logo
      }
    })

    // Return a success response with the created brand
    return NextResponse.json(newBrand, { status: 201 })
  } catch (error) {
    console.error('Error creating brand:', error)

    return NextResponse.json({ error: 'Error creating brand. Please try again later.' }, { status: 500 })
  }
}
