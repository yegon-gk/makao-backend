// src/config/prisma.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['warn', 'error'], // add 'query' while debugging if needed
});

process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;
