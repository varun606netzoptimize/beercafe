import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req) {
  try {
    const body = await req.json();
    const { RFID, amount, action } = body; // action should be 'credit' or 'debit'

    if (!RFID || !amount || !action) {
      return new Response(JSON.stringify({ error: 'RFID, amount, and action are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (action !== 'credit' && action !== 'debit') {
      return new Response(JSON.stringify({ error: 'Action must be "credit" or "debit"' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const rfidRecord = await prisma.customerRFID.findMany({
      where: {
        RFIDMaster: {
          rfidNumber: RFID
        }
      },
      include: {
        Customer: true
      }
    });

    if (rfidRecord.length === 0) {
      return new Response(JSON.stringify({ error: 'No record found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const customerId = rfidRecord[0].Customer.id;
    let updatedPoints;

    if (action === 'credit') {
      const updatedCustomer = await prisma.customer.update({
        where: { id: customerId },
        data: { points: { increment: amount } }
      });

      updatedPoints = updatedCustomer.points;
    } else {
      const updatedCustomer = await prisma.customer.update({
        where: { id: customerId },
        data: { points: { decrement: amount } }
      });

      updatedPoints = updatedCustomer.points;
    }

    await prisma.customerPointsHistory.create({
      data: {
        Customer: {
          connect: { id: customerId }
        },
        amount: amount,
        action: action,
        createdAt: new Date()
      }
    });

    const response = {
      RFID,
      updatedPoints
    };

    return new Response(
      JSON.stringify(response),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error updating points and history:', error);
    
return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  } finally {
    await prisma.$disconnect();
  }
}
