import { Request, Response } from 'express';
import prisma from '../services/prismaService';

export const createOffer = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { title, location, description, requirements, salary, slug, category, categorySlug, company_slug, postedDate, image, images, contractType, experience } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const newOffer = await prisma.offert.create({
      data: {
        userId,
        title,
        location,
        description,
        requirements,
        salary,
        slug,
        category,
        categorySlug,
        company_slug,
        postedDate: postedDate ? new Date(postedDate) : null,
        image,
        images,
        contractType,
        experience,
      },
    });
    return res.status(201).json(newOffer);
  } catch (error) {
    console.error('Error creating offer:', error);
    return res.status(500).json({ error: 'Error creating offer' });
  }
};


export const getAllOffersByUser = async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const offers = await prisma.offert.findMany({
      where: { userId },
      include: {
        applicants: true,
      },
    });
    return res.json(offers);
  } catch (error) {
    console.error('Error fetching offers:', error);
    return res.status(500).json({ error: 'Error fetching offers' });
  }
};
