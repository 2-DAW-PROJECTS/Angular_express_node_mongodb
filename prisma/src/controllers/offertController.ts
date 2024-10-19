import { Request, Response } from 'express';
import prisma from '../services/prismaService';

export const createOffert = async (req: Request, res: Response) => {
  const { userEnterpriseId } = req.body;
  try {
    const offert = await prisma.offert.create({
      data: { userEnterpriseId },
    });
    res.status(201).json(offert);
  } catch (error) {
    res.status(500).json({ error: 'Error creating offert' });
  }
};

export const getOfferts = async (req: Request, res: Response) => {
  try {
    const offerts = await prisma.offert.findMany({
      include: { userEnterprise: true, applications: true },
    });
    res.json(offerts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching offerts' });
  }
};
