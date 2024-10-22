import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

const testConnection = async () => {
  try {
    await prisma.$connect();
    console.log('Conexión a MongoDB exitosa.');
  } catch (error) {
    console.error('Error conectando a MongoDB:', error);
  } finally {
    await prisma.$disconnect(); 
  }
};

testConnection();

export default prisma;
