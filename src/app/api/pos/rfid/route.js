import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req, res) {
  try {
    const body = await req.json()
    const { RFID, machine_id } = body

    // // Basic validation
    if (!RFID || !machine_id) {
      return new Response(JSON.stringify({ error: 'RFID, machine_id is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const rfidRecord = await prisma.rFIDMaster.findMany({
      where: {
        rfidNumber: RFID
      },
      include: {
        customerRFID: {
          include: {
            Customer: {
            }
          }
        }
      }
    })

    if (!rfidRecord || !rfidRecord.length) {
      return new Response(JSON.stringify({ error: 'RFID not found!' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const response = {
      RFID: rfidRecord[0].rfidNumber,
      name: rfidRecord[0].customerRFID[0].Customer.firstname+" "+rfidRecord[0].customerRFID[0].Customer.lastname,
      mobile: rfidRecord[0].customerRFID[0].Customer.phoneNumber,
      amount: rfidRecord[0].customerRFID[0].Customer.points,
    }

    return new Response(JSON.stringify(response), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error(error)

    return new Response(JSON.stringify({ error: 'Server Error!' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  } finally {
    await prisma.$disconnect()
  }
}
