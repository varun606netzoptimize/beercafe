import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req, res) {
  try {
    const body = await req.json();
    const { id, name, location, address, description, parentId, priceConversionRate, slug } = body;

    // Basic validation
    if (!id || !name || !location || !address) {
      return new Response(
        JSON.stringify({ error: 'ID, name, location, and address are required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Find the cafe to update
    const existingCafe = await prisma.cafe.findUnique({
      where: { id },
    });

    if (!existingCafe) {
      return new Response(
        JSON.stringify({ error: 'Cafe not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Check if the slug is provided and unique (except for the current cafe)
    if (slug && slug !== existingCafe.slug) {
      const existingSlugCafe = await prisma.cafe.findUnique({
        where: { slug },
      });

      if (existingSlugCafe) {
        return new Response(
          JSON.stringify({ error: 'The provided slug already exists. Please use a unique slug.' }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // Update the cafe
    const updatedCafe = await prisma.cafe.update({
      where: { id },
      data: {
        name,
        location,
        address,
        description,
        parentId,
        priceConversionRate,
        slug,  // Optional slug, will be updated only if provided
      },
    });

    return new Response(JSON.stringify(updatedCafe), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);

    return new Response(
      JSON.stringify({ error: 'An error occurred while updating the cafe' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } finally {
    await prisma.$disconnect();
  }
}
