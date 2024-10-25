import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req) {
  try {
    const { brandId, cafeId, name, SKU, description, quantity, image } = await req.json()

    // Validate input: 'brandId', 'name', 'SKU', and 'quantity' are required, 'cafeId' is optional
    if (!brandId || !name || !SKU || !quantity) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 })
    }

    const exisitingSKU = await prisma.product.findUnique({
      where: { SKU: SKU }
    })

    if (exisitingSKU) {
      return new Response(JSON.stringify({ error: 'SKU already exists' }), { status: 404 })
    }

    // Create a new product in the database
    const newProduct = await prisma.product.create({
      data: {
        brandId,
        name,
        SKU,
        quantity,
        description: description || null,
        image: image || null,
        cafeId: cafeId || null // Only include cafeId if provided
      }
    })

    return new Response(JSON.stringify(newProduct), { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)

    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 })
  }
}
