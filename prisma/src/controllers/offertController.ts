import { Request, Response } from 'express';
import prisma from '../services/prismaService';
import slugify from 'slugify';

export const createOffer = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { title, location, description, requirements, salary, slug, category, categorySlug, postedDate, images, contractType, experience, isActive } = req.body;

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

    const defaultImages = [
      "carrousel_details/1.png",
      "carrousel_details/2.png",
      "carrousel_details/3.png",
      "carrousel_details/4.png",
      "carrousel_details/5.png"
    ];

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
        company_slug: slugify(user.username, { lower: true }),
        postedDate: postedDate ? new Date(postedDate) : null,
        image: user.logo,
        images: images && images.length > 0 ? images : defaultImages,
        contractType,
        experience,
        isActive,
        favouritesCount: 0,
        favorites: [],
        comments: [],
      },
    });

    res.status(201).json(newOffer);
  } catch (error) {
    console.error('Error al crear la oferta:', error);
    res.status(500).json({ error: 'Failed to create offer' });
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
  const { title, location, description, requirements, salary, slug, category, categorySlug, image, contractType, experience } = req.body;

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
        categorySlug,
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

export const updateOfferComments = async (req: Request, res: Response) => {
  const { id } = req.params; // Assuming you're passing id as parameter
  const { commentId } = req.body;

  try {
    const updatedOffer = await prisma.offert.update({
      where: { id }, // Use id to identify the offer
      data: {
        comments: {
          push: commentId // Ensure that commentId is a valid ObjectId
        }
      }
    });
    res.json(updatedOffer);
  } catch (error) {
    console.error('Error updating comments:', error);
    res.status(500).json({ message: 'Error al actualizar los comentarios de la oferta' });
  }
};

