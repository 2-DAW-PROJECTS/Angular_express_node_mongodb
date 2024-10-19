import { Request, Response } from 'express';
import prisma from '../services/prismaService';

export const createApplication = async (req: Request, res: Response) => {
  const { offertId, userId, status } = req.body;
  try {
    const application = await prisma.application.create({
      data: { offertId, userId, status },
    });
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ error: 'Error creating application' });
  }
};

export const getApplications = async (req: Request, res: Response) => {
  try {
    const applications = await prisma.application.findMany({
      include: { offert: true },
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching applications' });
  }
};
