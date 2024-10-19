import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

import userRoutes from './routes/userRoutes';
import applicationRoutes from './routes/applicationRoutes';
import offertRoutes from './routes/offertRoutes';
import { off } from 'process';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Rutas
app.use('/users', userRoutes);
app.use('/application', applicationRoutes);
app.use('/offerts', offertRoutes);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
