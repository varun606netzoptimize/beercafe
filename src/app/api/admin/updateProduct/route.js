import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PUT(req) {
  try {
    const { productId, brandId, cafeId, name, SKU, description, quantity, image } = await req.json()

    // Validate input: 'productId', 'brandId', 'name', 'SKU', and 'quantity' are required
    if (!productId) {
      return new Response(JSON.stringify({ error: 'Missing required productId' }), { status: 400 })
    }

    if (!brandId) {
      return new Response(JSON.stringify({ error: 'Missing required brandId' }), { status: 400 })
    }

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return new Response(JSON.stringify({ error: 'Invalid or missing name' }), { status: 400 })
    }

    if (!SKU || typeof SKU !== 'string' || SKU.trim() === '') {
      return new Response(JSON.stringify({ error: 'Invalid or missing SKU' }), { status: 400 })
    }

    if (typeof quantity !== 'number' || quantity < 0) {
      return new Response(JSON.stringify({ error: 'Invalid quantity, must be a positive number' }), { status: 400 })
    }

    // Optionally validate cafeId, description, and image if needed
    if (cafeId && typeof cafeId !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid cafeId' }), { status: 400 })
    }

    if (description && typeof description !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid description' }), { status: 400 })
    }

    if (image && typeof image !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid image URL' }), { status: 400 })
    }

    // Find the product to ensure it exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!existingProduct) {
      return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 })
    }

    const exisitingSKU = await prisma.product.findUnique({
      where: { SKU: SKU }
    })

    if (exisitingSKU) {
      return new Response(JSON.stringify({ error: 'SKU already exists' }), { status: 404 })
    }

    // Update the product in the database
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        brandId: brandId || existingProduct.brandId, // Keep existing value if not provided
        name: name || existingProduct.name,
        SKU: SKU || existingProduct.SKU,
        quantity: quantity || existingProduct.quantity,
        description: description || existingProduct.description,
        image: image || existingProduct.image,
        cafeId: cafeId || existingProduct.cafeId // Optional cafeId
      }
    })

    return new Response(JSON.stringify(updatedProduct), { status: 200 })
  } catch (error) {
    console.error('Error updating product:', error)

    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 })
  }
}

