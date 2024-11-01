import { Request, Response } from 'express';
import prisma from '../services/prismaService';

export const createOffer = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { title, location, description, requirements, salary, slug, category, categorySlug, postedDate, image, images, contractType, experience, isActive } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const user = await prisma.userEnterprise.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

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
        company: user.username, 
        postedDate: postedDate ? new Date(postedDate) : null,
        image,
        images,
        contractType,
        experience,
        isActive,
      },
    });

    console.log('Registro creado en la colección `offerts`:', newOffer);
    return res.status(201).json(newOffer);
  } catch (error) {
    console.error('Error creating offer in `offerts`:', error);
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

    const mappedOffers = offers.map(offer => ({
      ...offer,
      id: offer.id, 
      _id: undefined 
    }));

    return res.json(mappedOffers);
  } catch (error) {
    console.error('Error fetching offers:', error);
    return res.status(500).json({ error: 'Error fetching offers' });
  }
};

export const updateOfferStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isActive } = req.body;

  if (!id || typeof isActive === 'undefined') {
    return res.status(400).json({ error: 'Offer ID and status are required' });
  }

  try {
    const updatedOffer = await prisma.offert.update({
      where: { id },
      data: { isActive },
    });
    return res.json(updatedOffer);
  } catch (error) {
    console.error('Error updating offer status:', error);
    return res.status(500).json({ error: 'Error updating offer status' });
  }
};

export const getOfferById = async (id: string) => {
  try {
    const offer = await prisma.offert.findUnique({ where: { id } });
    return offer;
  } catch (error) {
    console.error('Error fetching offer by ID:', error);
    throw new Error('Offer not found');
  }
};

export const updateOffer = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, location, description, requirements, salary, slug, category, image, contractType, experience } = req.body;

  try {
    const updatedOffer = await prisma.offert.update({
      where: { id },
      data: {
        title,
        location,
        description,
        requirements,
        salary,
        slug,
        category,
        image,
        contractType,
        experience
      },
    });
    return res.json(updatedOffer);
  } catch (error) {
    console.error('Error updating offer:', error);
    return res.status(500).json({ error: 'Error updating offer' });
  }
};


export const deleteOffer = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Offer ID is required' });
  }

  try {
    const deletedOffer = await prisma.offert.delete({
      where: { id },
    });
    return res.json({ message: 'Offer deleted successfully', deletedOffer });
  } catch (error) {
    console.error('Error deleting offer:', error);
    return res.status(500).json({ error: 'Error deleting offer' });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany(); 
    console.log('Categories fetched:', categories);
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Error fetching categories' });
  }
};