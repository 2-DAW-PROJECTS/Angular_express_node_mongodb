import express from 'express';
import dotenv from 'dotenv';
import userEnterpriseRoutes from './routes/userEnterpriseRoutes';
import offertEnterpriseRoutes from './routes/offertEnterpriseRoutes';
import { PrismaClient } from '@prisma/client';
import cors from 'cors'; 

dotenv.config();

const app = express();

// CORS options
const corsOptions = {
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'], 
};

app.use(cors(corsOptions)); 

app.use(express.json());

app.use('/userEnterprises', userEnterpriseRoutes);
app.use('/offertEnterprise', offertEnterpriseRoutes);

const prisma = new PrismaClient();

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
