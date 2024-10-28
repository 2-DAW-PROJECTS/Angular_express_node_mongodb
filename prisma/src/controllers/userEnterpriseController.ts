import { Request, Response } from 'express';
import prisma from '../services/prismaService';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken'; 

const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET || 'AndIfWeDieWeWillBeAbleToSay_ItWasFun';

const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: '1h' });
};

export const createUserEnterprise = async (req: Request, res: Response) => {
  const {
    username,
    email,
    password,
    usertype,
    isActive,
    permissions,
    telephone,
    followers,
    description,
    industry,
    location,
    logo,
    website,
    image,
    slug,
    category
  } = req.body;

  // Comprobar los campos obligatorios
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required' });
  }

  try {
    const hashedPassword = await argon2.hash(password);

    const userEnterprise = await prisma.userEnterprise.create({
      data: {
        username,
        email,
        password: hashedPassword,
        usertype: usertype || 'enterprise',
        isActive: isActive !== undefined ? isActive : false,
        permissions: permissions || [],
        telephone: telephone || "",
        followers: followers || 0,
        description: description || "",
        industry: industry || "",
        location: location || "",
        logo: logo || "",
        website: website || "",
        category: category || "",
        slug: slug || "",
        image: image || ""
      },    
    });
    
    res.status(201).json(userEnterprise); 
  } catch (error) {
    console.error('Error creating user enterprise:', error);
    res.status(500).json({ error: 'Error creating user enterprise' });
  }
};

export const loginUserEnterprise = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await prisma.userEnterprise.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const validPassword = await argon2.verify(user.password, password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const access_token = generateAccessToken(user.id);  

    return res.json({
      access_token,
      usertype: user.usertype,  
      username: user.username,
      email: user.email,
      isActive: user.isActive,
      permissions: user.permissions,
      telephone: user.telephone,
      followers: user.followers,
      description: user.description,
      industry: user.industry,
      location: user.location,
      logo: user.logo,
      website: user.website,
      slug: user.slug,
      image: user.image,
      category: user.category,
    });  
  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ error: 'Error logging in' });
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

export const getCurrentUser = async (req: Request, res: Response) => {
  const user = req.user; 
  console.log('User from token:', req.user);
  
  if (!user || !user.userId) { 
    return res.status(400).json({ error: 'User information not provided' });
  }

  try {
    const userEnterprise = await prisma.userEnterprise.findUnique({
      where: { id: user.userId }, 
    });

    if (!userEnterprise) {
      return res.status(404).json({ message: 'User Enterprise Not Found' });
    }

    return res.status(200).json({
      userEnterprise, 
    });
  } catch (error) {
    console.error('Error fetching current user enterprise:', error);
    return res.status(500).json({ error: 'Error fetching current user enterprise' });
  }
};

