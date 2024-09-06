import { NextResponse } from 'next/server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const rfidNumber = url.pathname.split('/')[3]; // Get the RFID number from the URL

    if (!rfidNumber) {
      return new NextResponse(
        JSON.stringify({ message: 'RFID number is required' }),
        { status: 400 }
      );
    }

    // Fetch the RFID details based on the rfidNumber
    const rfidDetails = await prisma.rFIDMaster.findFirst({
      where: { rfidNumber: rfidNumber },
      include: {
        Cafe: true,
        customerRFID: {
          include: {
            Customer: true
          }
        }
      }
    });

    if (!rfidDetails) {
      return new NextResponse(
        JSON.stringify({ message: 'No RFID details found for this number' }),
        { status: 404 }
      );
    }

    // Ensure customerRFID is an object (if multiple exist, return the first one)
    const customerRFID = rfidDetails.customerRFID ? rfidDetails.customerRFID[0] || null : null;

    const result = {
      ...rfidDetails,
      customerRFID: customerRFID // Overwrite array with single object (or null if not found)
    };

    return new NextResponse(
      JSON.stringify({ rfidDetails: result }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching RFID details by RFID number:', error);

    return new NextResponse(
      JSON.stringify({ message: 'Server error' }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
