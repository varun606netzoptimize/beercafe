import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { rfidNumber, orderId, paymentStatus } = body;

    // Ensure required fields are present
    if (!rfidNumber || !orderId || !paymentStatus) {
      return new Response(
        JSON.stringify({ error: 'rfidNumber, orderId, and paymentStatus are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Step 1: Find the customer using rfidNumber
    const rfidRecord = await prisma.customerRFID.findFirst({
      where: { RFIDMaster: { rfidNumber } },
      include: { Customer: true },
    });

    if (!rfidRecord) {
      return new Response(
        JSON.stringify({ error: 'No customer found for the provided RFID number' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const customerId = rfidRecord.Customer.id;
    const customer = rfidRecord.Customer;

    // Step 2: Find the order using orderId
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        details: {
          select: { amount: true }
        }
      }
    });

    if (!order) {
      return new Response(
        JSON.stringify({ error: 'No order found for the provided orderId' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if the order has already been paid
    if (order.paymentStatus === 'PAID') {
      return new Response(
        JSON.stringify({ error: 'This order has already been paid' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Calculate the total order amount
    const totalOrderAmount = order.details.reduce((sum, detail) => sum + parseFloat(detail.amount), 0);

    // Step 3: Check if customer has enough points and deduct if sufficient
    if (customer.points < totalOrderAmount) {
      return new Response(
        JSON.stringify({ error: 'Insufficient points' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Deduct the total order amount from customer's points
    const updatedCustomer = await prisma.customer.update({
      where: { id: customerId },
      data: { points: { decrement: totalOrderAmount } },
      select: { points: true } // Select the updated points balance
    });

    // Step 4: Create a points history record
    await prisma.customerPointsHistory.create({
      data: {
        Customer: { connect: { id: customerId } },
        amount: totalOrderAmount,
        action: 'debit',
        createdAt: new Date()
      }
    });

    // Step 5: Update the order status and add customerId
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { 
        paymentStatus: paymentStatus,
        customerId: customerId // Add customerId here
      }
    });

    // Return a success message with the remaining balance and the amount deducted
    return new Response(
      JSON.stringify({
        message: 'Order processed and points updated successfully',
        deductedAmount: totalOrderAmount,
        remainingBalance: updatedCustomer.points
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing order and updating customer points:', error);

    return new Response(
      JSON.stringify({ error: 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  } finally {
    await prisma.$disconnect();
  }
}
