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

    return new Response(
      JSON.stringify(transaction),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error fetching the transaction:', error);

return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  } finally {
    await prisma.$disconnect();
  }
}
