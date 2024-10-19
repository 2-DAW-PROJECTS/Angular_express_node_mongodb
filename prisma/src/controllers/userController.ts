import { Request, Response } from 'express';
import prisma from '../services/prismaService';

export const createUserEnterprise = async (req: Request, res: Response) => {
  const { username, email, password, telefon, permissions } = req.body;
  try {
    const userEnterprise = await prisma.userEnterprise.create({
      data: { 
        username, 
        email, 
        password, 
        telefon, 
        permissions,
        followers: [],
      },
    });
    res.status(201).json(userEnterprise);
  } catch (error) {
    res.status(500).json({ error: 'Error creating user enterprise' + error });
  }
};

export const getUserEnterprises = async (req: Request, res: Response) => {
  try {
    const userEnterprises = await prisma.userEnterprise.findMany();
    res.json(userEnterprises);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user enterprises' });
  }
};
