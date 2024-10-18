import { Request, Response } from 'express';
import prisma from '../services/prismaService';

export const createUser = async (req: Request, res: Response) => {
  const { email, name } = req.body;

  console.log('email', email);
  console.log('name', name);

  try {
    const user = await prisma.user.create({
      data: { email, name },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' + error });
    }
  };

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: { posts: true, comments: true },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
};
