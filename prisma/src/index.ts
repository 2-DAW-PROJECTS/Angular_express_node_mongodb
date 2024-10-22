import express from 'express';
import dotenv from 'dotenv';
import userEnterpriseRoutes from './routes/userEnterpriseRoutes';  
import { PrismaClient } from '@prisma/client';

dotenv.config();  

const app = express();

app.use(express.json());

app.use('/userEnterprises', userEnterpriseRoutes);  

const prisma = new PrismaClient();

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
