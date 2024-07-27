import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req) {
  try {
    const { name, location } = await req.json()

    console.log('Received request data:', { name, location })

    // Check if essential data is provided
    if (!name || !location) {
      console.log('Name and location are required')

      return new Response(JSON.stringify({ message: 'Name and location are required' }), { status: 400 })
    }

    // Construct cafe data
    const cafeData = {
      name,
      location
    }

    console.log('Constructed cafeData:', cafeData)

    // Create new cafe
    const newCafe = await prisma.cafe.create({
      data: cafeData,
      include: { managers: true } // Include managers in the response
    })

    console.log('Cafe created successfully:', newCafe)

    return new Response(JSON.stringify({ message: 'Cafe created successfully', cafeData: newCafe }), { status: 201 })
  } catch (error) {
    console.error('Error creating cafe:', error)

    return new Response(JSON.stringify({ message: 'Error creating cafe' }), { status: 500 })
  }
}
