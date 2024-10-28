import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'

import { getUserIdFromToken } from '../../utils/jwt'


const prisma = new PrismaClient()

export async function GET(req) {
  try {
    const url =  new URL(req.url)
    const searchParams = url.searchParams

    const token = req.headers.get('Authorization')?.split(' ')[1]

    if(!token){
        return NextResponse.json({
            error: 'Unauthorized'
        }, {status: 401})
    }

    const userId = getUserIdFromToken(token)

     // If userId is invalid
     if (!userId) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

      // Extract and validate pagination and sorting params
      const filters = {
        cafeId: searchParams.get('cafeId'),
        sortBy: searchParams.get('sortBy'),
        sortOrder: searchParams.get('sortOrder') === 'desc' ? 'desc' : 'asc', // default to 'asc'
        page: Math.max(Number(searchParams.get('page')) || 1, 1), // default to 1, min 1
        pageSize: Math.max(Number(searchParams.get('pageSize')) || 10, 1), // default to 10, min 1
        search: searchParams.get('query')
      }

          // Fetch cafes associated with the user
    const userCafes = await prisma.cafeUser.findMany({
        where: { userId: userId },
        include: {
         user : {
            include: {
                userType: {
                    where: {
                        
                    }
                }
            }
         }
        }
      })
  
      // If user has no cafes
      if (userCafes.length === 0) {
        return NextResponse.json({
          data: [],
          meta: {
            totalProductsCount: 0,
            currentPage: filters.page,
            pageSize: filters.pageSize,
            totalPages: 0
          }
        })
      }
  


    
  } catch (err) {
  return  NextResponse.json({ error: err }, { status: 500 })
  }
}
