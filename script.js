// script.js
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const firstCafe = await prisma.cafe.findMany({
    orderBy: {
      createdAt: 'asc' // Order by creation date ascending; change if needed
    }
  })

  console.log(firstCafe[1].id)

  const newBrand = await prisma.brands.create({
    data: {
      name: 'Bira 91',
      description:
        'The brand has a selection of flavoured beers such as stout with coffee beans, wheat beer with mango and more in addition to the unflavoured options',
      logo: ''
    }
  })

  console.log('Created Brank:', newBrand)


  // Create a new Product
  const newProduct = await prisma.product.create({
    data: {
      brandId: newBrand.id,
      cafeId: firstCafe[1].id,
      name: 'MALABAR STOUT',
      SKU: 'SKUBIR91',
      description: 'Coffie STOUT',
      quantity: 50,
      image: ''
    }
  })

  console.log('Created Product:', newProduct)

  // Create a new ProductVariation
  const newProductVariation = await prisma.productVariation.create({
    data: {
      productId: newProduct.id,
      key: 'Quantity',
      value: '500ml',
      salePrice: 400,
      regularPrice: 250,
      points: 17
    }
  })

  console.log('Created Product Variation:', newProductVariation)

  // // Create a new Order
  // const newOrder = await prisma.order.create({
  //   data: {
  //     customerId: 'customer1',
  //     amount: 39.98,
  //     paymentMode: 'Credit Card',
  //     paymentStatus: 'Paid'
  //   }
  // })
  // console.log('Created Order:', newOrder)

  // // Create a new OrderDetail
  // const newOrderDetail = await prisma.orderDetail.create({
  //   data: {
  //     orderId: newOrder.id,
  //     quantity: 2,
  //     amount: 39.98,
  //     productVariationId: newProductVariation.id
  //   }
  // })
  // console.log('Created Order Detail:', newOrderDetail)

  //   Create a new MachineMaster
  const newMachineMaster = await prisma.machineMaster.create({
    data: {
      cafeId: firstCafe[1].id,
      machineRefNumber: 'MACHINECC222'
    }
  })

  console.log('Created MachineMaster:', newMachineMaster)
}

async function addCustomers() {
  const firstCafe = await prisma.cafe.findMany({
    orderBy: {
      createdAt: 'asc' // Order by creation date ascending; change if needed
    }
  })

  const productVariationData = await prisma.productVariation.findMany({
    orderBy: {
      createdAt: 'asc' // Order by creation date ascending; change if needed
    }
  })

  const newCustomer = await prisma.customer.create({
    data: {
      firstname: 'Neeraj',
      lastname: 'Kumar',
      phoneNumber: '9316040873',
      points: 1500
    }
  })

  console.log('Created Customer:', newCustomer)

  const newCafeCustomer = await prisma.cafeCustomers.create({
    data: {
      cafeId: firstCafe[1].id,
      customerID: newCustomer.id
    }
  })

  console.log('Created cafe customer:', newCafeCustomer)

  //   const newrfid = await prisma.rFIDMaster.create({
  //     rfidNumber: 'RFID-1234-ABCD'
  //   })

  //   const newCustomerRFID = await prisma.customerRFID.create({
  //     data: {
  //       customerID: newCustomer.id,
  //       RFIDMasterId: newrfid.id,
  //       points: 1000
  //     }
  //   })
  //   console.log('Created Customer rfid:', newCustomerRFID)

  const newOrder = await prisma.order.create({
    data: {
      customerId: newCustomer.id,
      amount: 400,
      paymentMode: 'ONLINE',
      paymentStatus: 'PENDING'
    }
  })

  console.log('Created Order:', newOrder)

  const newOrderDetail = await prisma.orderDetail.create({
    data: {
      orderId: newOrder.id,
      quantity: 1,
      amount: 400,
      productVariationId: productVariationData[2].id
    }
  })

  console.log('Created Order:', newOrderDetail)
}

async function attachRFIDS() {
  const allCustomers = await prisma.customer.findMany({
    orderBy: {
      createdAt: 'asc' // Order by creation date ascending; change if needed
    }
  })

  const allRFIDs = await prisma.rFIDMaster.findMany()

  //   console.log(allRFIDs)

  //   const newrfid = await prisma.rFIDMaster.create({
  //     data: {
  //       rfidNumber: 'RFID-5846-JKLM',
  //       expiry: new Date('2025-08-08T00:00:00Z'), // Example expiry date
  //       createdAt: new Date(),
  //       updatedAt: new Date()
  //     }
  //   })

  const allCustomerRFIDs = await prisma.customerRFID.findMany()

  console.log(allCustomerRFIDs)

  const newCustomerRFID = await prisma.customerRFID.create({
    data: {
      Customer: {
        connect: {
          id: allCustomers[2].id // ID of the existing Customer
        }
      },
      RFIDMaster: {
        connect: {
          id: allRFIDs[2].id // ID of the existing RFIDMaster
        }
      }
    }
  })

  console.log('Created Customer rfid:', newCustomerRFID)
}

attachRFIDS()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
