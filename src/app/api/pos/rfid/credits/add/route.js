import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req, res) {
  try {
    const body = await req.json()
    const { RFID, name, phone, amount } = body

    // // Basic validation
    if (!RFID || !name || !phone || !amount) {
      return new Response(JSON.stringify({ error: 'RFID, name, phone and amount is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const nameParts = name.trim().split(/\s+/)
    const firstname = nameParts[0]
    const lastname = nameParts.slice(1).join(' ')

    const rfidRecord = await prisma.customerRFID.findMany({
      where: {
        AND: [
          {
            RFIDMaster: {
              rfidNumber: RFID
            }
          },
          {
            Customer: {
              firstname: firstname,
              lastname: lastname,
              phoneNumber: phone
            }
          }
        ]
      },
      include: {
        RFIDMaster: true,
        Customer: true
      }
    })

    let updatedAmount = 0

    if (!rfidRecord || !rfidRecord.length) {
      return new Response(JSON.stringify({ error: 'No record was found!' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    } else {
      const updatedCustomer = await prisma.customer.update({
        where: {
          id: rfidRecord[0].customerId
        },
        data: {
          points: {
            increment: amount
          }
        }
      })

      updatedAmount = updatedCustomer.points

      const addPointHistory = await prisma.customerPointsHistory.create({
        data: {
          Customer: {
            connect: {
              id: rfidRecord[0].customerId
            }
          },
          amount: amount,
          action: 'credit',
          createdAt: new Date()
        }
      })
    }

    const response = {
      RFID: rfidRecord[0].RFIDMaster.rfidNumber,
      amount: updatedAmount
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
