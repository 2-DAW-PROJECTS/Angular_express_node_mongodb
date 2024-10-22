import { Request, Response } from 'express';
import prisma from '../services/prismaService';

export const createUserEnterprise = async (req: Request, res: Response) => {
  const {  username, email, password, name, usertype, isActive, permissions, telephone, followers } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required' });
  }

  try {
    console.log('Data being sent to create:', { username, email, password, name, usertype, isActive, permissions, telephone, followers });
    const userEnterprise = await prisma.userEnterprise.create({
      data: {
        username,
        email,
        password,
        name,  // Add this line
        usertype: usertype || 'enterprise',
        isActive: isActive !== undefined ? isActive : true,
        permissions: permissions || [],
        telephone,
        followers: followers || 0
      },
    });

    const createdUser = await prisma.userEnterprise.findUnique({
      where: { id: userEnterprise.id },
      include: { offerts: true, posts: true, comments: true }
    });
    res.status(201).json(createdUser);
    
    
    res.status(201).json(userEnterprise);
  } catch (error) {
    console.error('Error creating user enterprise:', error);
    res.status(500).json({ error: 'Error creating user enterprise' });
  }
};

export const getUserEnterprises = async (req: Request, res: Response) => {
  try {
    const userEnterprises = await prisma.userEnterprise.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        usertype: true,
        isActive: true,
        permissions: true,
        telephone: true,
        followers: true,
        offerts: true,
        posts: true,
        comments: true,
      }as const,
    });
    
    res.json(userEnterprises);
  } catch (error) {
    console.error('Error fetching user enterprises:', error);
    res.status(500).json({ error: 'Error fetching user enterprises' });
  }
};