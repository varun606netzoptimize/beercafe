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
              include: {
                Order: {
                  include: {
                    details: {
                      include: {
                        productVariation: {
                          include: {
                            product: {
                              include: {
                                Brand: {}
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!rfidRecord || !rfidRecord.length) {
      return new Response(JSON.stringify({ error: 'Bad Request!' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const response = {
      auth_id: '3123213213',
      brand_id: rfidRecord[0].customerRFID[0].Customer.Order[0].details[0].productVariation.product.Brand.id,
      brand_name: rfidRecord[0].customerRFID[0].Customer.Order[0].details[0].productVariation.product.Brand.name,
      quantity: rfidRecord[0].customerRFID[0].Customer.Order[0].details[0].quantity,
      order_id: rfidRecord[0].customerRFID[0].Customer.Order[0].id
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
