const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // Define roles to be created
  const roles = ['admin', 'owner', 'manager', 'user']

  // Create each role if it does not exist
  for (const role of roles) {
    try {
      await prisma.userRole.create({
        data: { role }
      })
    } catch (error) {
      if (error.code === 'P2002') {
        // This error code means a unique constraint failed (duplicate role)
        console.log(`Role "${role}" already exists.`)
      } else {
        // Rethrow any other error
        throw error
      }
    }
  }

  console.log('User roles have been seeded.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
