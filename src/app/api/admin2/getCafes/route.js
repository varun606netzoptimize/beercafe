// File: /api/admin2/getCafes.js

import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'

import { verifyAdmin } from '../../utils/verifyAdmin'

const prisma = new PrismaClient()

export async function GET(req) {
  // Verify if the request is from an admin
  const adminAuthResponse = await verifyAdmin(req)

  if (adminAuthResponse) return adminAuthResponse

  try {
    // Extract pagination and sorting parameters from query
    const url = new URL(req.url, `http://${req.headers.host}`)
    const page = parseInt(url.searchParams.get('page')) || 1
    const limit = parseInt(url.searchParams.get('limit')) || 10
    const sortBy = url.searchParams.get('sortBy') || 'name' // Default sorting by name
    const sortOrder = url.searchParams.get('sortOrder') || 'asc' // Default sorting order ascending
    const ownerId = url.searchParams.get('ownerId') // Filter by ownerId if provided
    const parentId = url.searchParams.get('parentId') // Filter by parentId if provided

    // Validate sortBy and sortOrder to prevent invalid values
    const validSortFields = ['name', 'location', 'createdAt']
    const validSortOrders = ['asc', 'desc']
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'name'
    const sortDirection = validSortOrders.includes(sortOrder) ? sortOrder : 'asc'

    // Build the filter object based on ownerId and parentId
    const filters = {}

    if (ownerId) filters.ownerId = ownerId
    if (parentId) filters.parentId = parentId

    // Fetch cafes with pagination and sorting
    const cafes = await prisma.cafe.findMany({
      where: filters,
      orderBy: {
        [sortField]: sortDirection
      },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        // Optionally include related models
        manager: true // Include manager details if needed
      }
    })

    // Get the total number of cafes based on the filters
    const totalCafes = await prisma.cafe.count({
      where: filters
    })

    // Calculate total number of pages
    const totalPages = Math.ceil(totalCafes / limit)
    const hasNextPage = page < totalPages

    // Check if the current page has no cafes
    if (cafes.length === 0 && page > totalPages) {
      return new NextResponse(
        JSON.stringify({
          message: 'No cafes found',
          cafes: [],
          pagination: {
            page,
            limit,
            totalCafes,
            totalPages,
            hasNextPage: false
          }
        }),
        { status: 200 }
      )
    }

    return new NextResponse(
      JSON.stringify({
        message: 'Cafes fetched successfully',
        cafes,
        pagination: {
          page,
          limit,
          totalCafes,
          totalPages,
          hasNextPage
        }
      }),
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching cafes:', error)

    return new NextResponse(JSON.stringify({ message: 'Server error' }), { status: 500 })
  }
}
