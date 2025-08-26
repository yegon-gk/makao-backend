const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['warn', 'error'], // add 'query' while debugging if you like
});

process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = prisma;
