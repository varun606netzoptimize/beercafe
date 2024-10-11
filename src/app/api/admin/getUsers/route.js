import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req) {
  try {
    // Extract pagination, sorting, and search parameters from query
    const url = new URL(req.url, `http://${req.headers.host}`)
    const page = parseInt(url.searchParams.get('page')) || 1
    const limit = parseInt(url.searchParams.get('limit')) || 10
    const sortBy = url.searchParams.get('sortBy') || 'name'
    const sortOrder = url.searchParams.get('sortOrder') || 'asc'
    const search = url.searchParams.get('search') || '' // Get search query
    const excludedUserTypeId = '66b3583586109427057d989f' // Define the userTypeId to exclude

    // Validate sortBy and sortOrder
    const validSortFields = ['name', 'email', 'createdAt']
    const validSortOrders = ['asc', 'desc']
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'name'
    const sortDirection = validSortOrders.includes(sortOrder) ? sortOrder : 'asc'

    // Fetch users with pagination, sorting, and search
    const users = await prisma.user.findMany({
      where: {
        userTypeId: {
          not: excludedUserTypeId // Exclude users with the specified userTypeId
        },
        OR: [
          { name: { contains: search, mode: 'insensitive' } }, // Search by user name
          { email: { contains: search, mode: 'insensitive' } }, // Search by email
          { phoneNumber: { contains: search, mode: 'insensitive' } }, // Search by phone number
          {
            cafeUsers: {
              some: {
                cafe: {
                  name: { contains: search, mode: 'insensitive' } // Search by cafe name
                }
              }
            }
          }
        ]
      },
      orderBy: { [sortField]: sortDirection },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        userType: {
          select: {
            type: true // Show only the userType type value
          }
        },
        cafeUsers: {
          include: {
           cafe: true
          }
        } // Show only
      },
    })

    // Get the total number of users excluding the specified userTypeId and including search criteria
    const totalUsers = await prisma.user.count({
      where: {
        userTypeId: {
          not: excludedUserTypeId // Exclude users with the specified userTypeId
        },
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phoneNumber: { contains: search, mode: 'insensitive' } },
          {
            cafeUsers: {
              some: {
                cafe: {
                  name: { contains: search, mode: 'insensitive' }
                }
              }
            }
          }
        ]
      }
    })

    // Calculate total number of pages
    const totalPages = Math.ceil(totalUsers / limit)
    const hasNextPage = page < totalPages

    // Fetch branches owned and managers for users with the "owner" type
    // const usersWithBranches = await Promise.all(
    //   users.map(async user => {
    //     const branchesOwned =
    //       user.userType.type === 'owner'
    //         ? await prisma.cafe.findMany({
    //             where: { parentId: { in: user.cafeUsers.map(cu => cu.cafe.id) } },
    //             select: {
    //               id: true,
    //               name: true,
    //               location: true,
    //               address: true,
    //               description: true,
    //               priceConversionRate: true,
    //               parentId: true,
    //               cafeUsers: {
    //                 // Fetch only name and id of users (managers) associated with each branch
    //                 select: {
    //                   user: {
    //                     select: {
    //                       id: true,
    //                       name: true
    //                     }
    //                   }
    //                 }
    //               }
    //             }
    //           })
    //         : []

    //     // Transform the branchesOwned data
    //     const transformedBranchesOwned = branchesOwned.map(branch => ({
    //       id: branch.id,
    //       name: branch.name,
    //       location: branch.location,
    //       address: branch.address,
    //       description: branch.description,
    //       priceConversionRate: branch.priceConversionRate,
    //       parentId: branch.parentId,
    //       users: branch.cafeUsers.map(cafeUser => ({
    //         id: cafeUser.user.id,
    //         name: cafeUser.user.name
    //       }))
    //     }))

    //     return {
    //       id: user.id,
    //       name: user.name,
    //       email: user.email,
    //       phoneNumber: user.phoneNumber,
    //       userType: user.userType.type, // Include only the userType type value
    //       createdAt: user.createdAt,
    //       updatedAt: user.updatedAt,
    //       deletedAt: user.deletedAt,
    //       cafes:
    //         user.cafeUsers.length > 0
    //           ? user.cafeUsers.map(cafeUser => {
    //               console.log(cafeUser.cafe.id, 'transformedBranchesOwned')

    //               return {
    //                 id: cafeUser.cafe.id,
    //                 name: cafeUser.cafe.name
    //               }
    //             })
    //           : [],
    //       branches_owned: transformedBranchesOwned // Include branches owned if user is an owner
    //     }
    //   })
    // )

    // Return the response with pagination info
    return new NextResponse(
      JSON.stringify({
        users: users,
        pagination: {
          page,
          limit,
          totalUsers,
          totalPages,
          hasNextPage
        }
      }),
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching users:', error)

    return new NextResponse(JSON.stringify({ message: 'Server error' }), { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
