import { Request, Response } from 'express';
import prisma from '../services/prismaService';
import argon2 from 'argon2';
import jwt, { JwtPayload } from 'jsonwebtoken'; 

const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET || 'AndIfWeDieWeWillBeAbleToSay_ItWasFun';  

const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: '1h' });  
};

export const createUserEnterprise = async (req: Request, res: Response) => {
  const { username, email, password, usertype, isActive, permissions, telephone, followers } = req.body;

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

// Login de usuario de empresa
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

    return res.json({ access_token });  
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
