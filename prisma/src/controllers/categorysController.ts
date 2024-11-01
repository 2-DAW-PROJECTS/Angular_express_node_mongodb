import { Request, Response } from 'express';
import prisma from '../services/prismaService';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany();
    return res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ error: 'Error fetching categories' });
  }
};
