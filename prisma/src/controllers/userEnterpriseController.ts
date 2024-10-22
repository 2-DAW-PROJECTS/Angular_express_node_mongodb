import { Request, Response } from 'express';
import prisma from '../services/prismaService';  

export const createUserEnterprise = async (req: Request, res: Response) => {
  const { username, email, password, usertype, isActive, permissions, telephone, followers } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required' });
  }

  try {
    const userEnterprise = await prisma.userEnterprise.create({
      data: {
        username,
        email,
        password,
        usertype: usertype || 'enterprise',
        isActive: isActive !== undefined ? isActive : true,
        permissions: permissions || [],
        telephone,
        followers: followers || 0,
      },
    });

    const createdUser = await prisma.userEnterprise.findUnique({
      where: { id: userEnterprise.id },
      include: { offerts: true },
    });

    res.status(201).json(createdUser);  
  } catch (error) {
    console.error('Error creating user enterprise:', error);
    res.status(500).json({ error: 'Error creating user enterprise' });
  }
};

export const getUserEnterprises = async (req: Request, res: Response) => {
  try {
    const userEnterprises = await prisma.userEnterprise.findMany();
    return res.json(userEnterprises);
  } catch (error) {
    console.error('Error fetching user enterprises:', error);
    return res.status(500).json({ error: 'Error fetching user enterprises' });
  }
};
