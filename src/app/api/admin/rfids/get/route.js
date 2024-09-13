import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`)
    const sortBy = url.searchParams.get('sortBy') || 'rfidNumber'
    const sortOrder = url.searchParams.get('sortOrder') || 'asc'
    const search = url.searchParams.get('search') || ''
    const page = url.searchParams.get('search') || 1
    const pageSize = url.searchParams.get('search') || 10

    const rfids = await prisma.rFIDMaster.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  { rfidNumber: { contains: search, mode: 'insensitive' } }, // Search by rfidNumber
                  { Cafe: { name: { contains: search, mode: 'insensitive' } } }, // Search by cafe name
                  {
                    customerRFID: {
                      some: {
                        Customer: { firstname: { contains: search, mode: 'insensitive' } }
                      }
                    }
                  }
                ]
              }
            : {}
        ]
      },
      include: {
        customerRFID: {
          include: {
            Customer: {}
          }
        },
        Cafe: true
      },
      orderBy: getOrderBy(sortBy, sortOrder),
      skip: (page - 1) * pageSize,
      take: pageSize
    })
    return NextResponse.json(rfids)
  } catch (error) {
    console.error('Error fetching users:', error)

    return new NextResponse(JSON.stringify({ message: 'Server error' }), { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

function getOrderBy(sortBy, sortOrder) {
  const sortOptions = []

  switch (sortBy) {
    case 'rfidNumber':
      sortOptions.push({ rfidNumber: sortOrder })
      break
    case 'expiry':
      sortOptions.push({ expiry: sortOrder })
      break
    case 'cafe':
      sortOptions.push({ Cafe: { name: sortOrder } })
      break
    case 'customer':
      sortOptions.push({ customerRFID: { some: { Customer: { firstname: sortOrder } } } })
      break
    default:
      sortOptions.push({ rfidNumber: 'asc' }) // Default sort by rfidNumber if no valid field is provided
  }

  return sortOptions
}
