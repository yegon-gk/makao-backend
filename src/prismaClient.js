// src/prismaClient.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();   // Singleton Prisma Client

export default prisma;               // Corrected: Export default instance
