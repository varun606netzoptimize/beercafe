import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const { slug } = params;

  try {
    const cafe = await prisma.cafe.findUnique({
      where: { slug: slug },
      include: {
      },
    });

    if (!cafe) {
      return new Response('Cafe not found', { status: 404 });
    }

    return new Response(JSON.stringify(cafe), { status: 200 });
  } catch (error) {
    console.error('Error fetching cafe:', error);
    
return new Response('Server error', { status: 500 });
  }
}
