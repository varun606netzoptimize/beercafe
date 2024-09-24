import { NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();


export async function GET(req){

  try {

    const orders = await prisma.order.findMany({
      where: {
        cafeId: {
          not: null
        }
      },
      include: {
        Customer: true,
        Cafe: true,
        CustomerPointsHistory: true,
        details: {
          include: {
            productVariation : {
              include: {
                product: true,
              }
            }
          }
        },

      }
    });

    return NextResponse.json(orders);
  } catch (error){
    console.error('Error fetching orders:', error);

    return NextResponse.json({ error: 'Fialed to fetch orders' }, { status: 500 });
  }
}
