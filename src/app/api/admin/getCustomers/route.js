import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req) {
  try {
    // Extract pagination, sorting, and search parameters from query
    const url = new URL(req.url, `http://${req.headers.host}`)
    const page = parseInt(url.searchParams.get('page')) || 1
    const limit = parseInt(url.searchParams.get('limit')) || 10
    const sortBy = url.searchParams.get('sortBy') || 'firstname'
    const sortOrder = url.searchParams.get('sortOrder') || 'asc'
    const search = url.searchParams.get('search') || '' // Get search query

    // Validate sortBy and sortOrder
    const validSortFields = ['firstname', 'lastname', 'createdAt', 'phoneNumber', 'points']
    const validSortOrders = ['asc', 'desc']
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'firstname'
    const sortDirection = validSortOrders.includes(sortOrder) ? sortOrder : 'asc'

    // Fetch customers with pagination, sorting, and search
    const customers = await prisma.customer.findMany({
      where: {
        AND: [
          {
            OR: [
              { firstname: { contains: search, mode: 'insensitive' } }, // Search by first name
              { lastname: { contains: search, mode: 'insensitive' } }, // Search by last name
              { phoneNumber: { contains: search, mode: 'insensitive' } }, // Search by phone number
              // Adjust for points field if it's a number
              ...(isNaN(Number(search))
                ? [] // No search criteria for points if `search` is not a number
                : [{ points: { equals: Number(search) } }]) // Search by points as an exact match
            ]
          }
        ]
      },
      orderBy: { [sortField]: sortDirection },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        firstname: true,
        lastname: true,
        phoneNumber: true,
        points: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        CafeCustomers: {
          select: {
            cafe: {
              select: {
                id: true,
                name: true,
                location: true,
                address: true,
                description: true,
                priceConversionRate: true,
                parentId: true
              }
            }
          }
        },
        customerRFID: {
          select: {
            RFIDMaster: {
              select: {
                rfidNumber: true,
                expiry: true
              }
            }
          }
        },
        Order: {
          select: {
            id: true,
            amount: true,
            paymentMode: true,
            paymentStatus: true,
            createdAt: true
          }
        }
      }
    })

    // Get the total number of customers with search criteria
    const totalCustomers = await prisma.customer.count({
      where: {
        AND: [
          {
            OR: [
              { firstname: { contains: search, mode: 'insensitive' } },
              { lastname: { contains: search, mode: 'insensitive' } },
              { phoneNumber: { contains: search, mode: 'insensitive' } },
              ...(isNaN(Number(search)) ? [] : [{ points: { equals: Number(search) } }])
            ]
          }
        ]
      }
    })

    // Calculate total number of pages
    const totalPages = Math.ceil(totalCustomers / limit)
    const hasNextPage = page < totalPages

    // Transform the customer data
    const transformedCustomers = customers.map(customer => ({
      id: customer.id,
      firstname: customer.firstname,
      lastname: customer.lastname,
      phoneNumber: customer.phoneNumber,
      points: customer.points,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
      deletedAt: customer.deletedAt,
      cafes: customer.CafeCustomers.map(cafeCustomer => ({
        id: cafeCustomer.cafe.id,
        name: cafeCustomer.cafe.name,
        location: cafeCustomer.cafe.location,
        address: cafeCustomer.cafe.address,
        description: cafeCustomer.cafe.description,
        priceConversionRate: cafeCustomer.cafe.priceConversionRate,
        parentId: cafeCustomer.cafe.parentId
      })),
      rfid: customer.customerRFID.map(rfid => ({
        number: rfid.RFIDMaster.rfidNumber,
        expiry: rfid.RFIDMaster.expiry
      })),
      orders: customer.Order.map(order => ({
        id: order.id,
        amount: order.amount,
        paymentMode: order.paymentMode,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt
      }))
    }))

    // Return the response with pagination info
    return new NextResponse(
      JSON.stringify({
        message: 'Customers fetched successfully',
        customers: transformedCustomers,
        pagination: {
          page,
          limit,
          totalCustomers,
          totalPages,
          hasNextPage
        }
      }),
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching customers:', error)

    return new NextResponse(JSON.stringify({ message: 'Server error' }), { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
