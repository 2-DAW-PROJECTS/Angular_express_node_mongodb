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

export const getUserEnterpriseByEmail = async (req: Request, res: Response) => {
  const { email } = req.params;
  try {
    const userEnterprise = await prisma.userEnterprise.findUnique({
      where: { email },
    });
    if (userEnterprise) {
      res.json(userEnterprise);
    } else {
      res.status(404).json({ error: 'User enterprise not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user enterprise' });
  }
};

export const updateUserEnterprise = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { username, email, password, telefon, permissions, isActive } = req.body;
  try {
    const updatedUserEnterprise = await prisma.userEnterprise.update({
      where: { id },
      data: { username, email, password, telefon, permissions, isActive },
    });
    res.json(updatedUserEnterprise);
  } catch (error) {
    res.status(500).json({ error: 'Error updating user enterprise' });
  }
};