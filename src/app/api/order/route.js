import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { customerId, amount, paymentMode, paymentStatus, details, cafeId  } = await req.json();

    // Ensure required fields are present
    if (!amount || !paymentMode || !paymentStatus || !details || !cafeId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create the order
    const order = await prisma.order.create({
      data: {
        amount,
        paymentMode,
        paymentStatus,
        details: {
          create: details.map(detail => ({
            quantity: detail.quantity,
            amount: detail.amount,
            productVariationId: detail.productVariationId,
          })),
        },
        cafeId: cafeId
      },
      include: {
        details: true,
      },
    });

    return new Response(
      JSON.stringify(order),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating order:', error);

    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(req) {
  try {
    const { orderId, customerId } = await req.json();

    // Ensure required fields are present
    if (!orderId || !customerId) {
      return new Response(
        JSON.stringify({ error: 'orderId and customerId are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Update the order with the customerId
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { customerId },
    });

    return new Response(
      JSON.stringify(updatedOrder),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error updating order:', error);

    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  } finally {
    await prisma.$disconnect();
  }
}
