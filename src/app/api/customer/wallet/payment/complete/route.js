import { PaymentStatus } from '@/constants/paymentStatus';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req) {
  try {
    const body = await req.json();
    const { payment_id } = body; // action should be 'credit' or 'debit'

    if (!payment_id) {
      return new Response(JSON.stringify({ error: 'Payment Id is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const transaction = await prisma.customerPointsHistory.findFirst({
      where: {
        id: payment_id
      }
    })

    if(transaction.status === PaymentStatus.Pending){
      const pointsHistory = await prisma.customerPointsHistory.update({
        where: { id: payment_id },
        data: { status: PaymentStatus.Completed, updatedAt: new Date() }
      })
  
      const updatedCustomer = await prisma.customer.update({
        where: { id: pointsHistory.customerId },
        data: { points: { increment: pointsHistory.amount } }
      });
      
      return new Response(
        JSON.stringify(updatedCustomer),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
    else{
      return new Response(
        JSON.stringify("Payment has already been completed"),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
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
