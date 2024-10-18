import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Rutas
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
