import { Request, Response } from 'express';
import prisma from '../services/prismaService';

// export const createUserEnterprise = async (req: Request, res: Response) => {
//   const { email, name } = req.body;

//   if (!email || !name) {
//     return res.status(400).json({ error: 'Email and name are required' });
//   }

//   try {
//     const userEnterprise = await prisma.userEnterprise.create({
//       data: { email, name },
//     });

//     res.status(201).json(userEnterprise);
//   } catch (error) {
//     console.error('Error creating user enterprise:', error);
//     res.status(500).json({ error: 'Error creating user enterprise' });
//   }
// };

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
        followers: followers || 0
      },
    });
    console.log('User enterprise created:', userEnterprise);
    
    res.status(201).json(userEnterprise);
  } catch (error) {
    console.error('Error creating user enterprise:', error);
    res.status(500).json({ error: 'Error creating user enterprise' });
  }
};

// export const getUserEnterprises = async (req: Request, res: Response) => {
//   try {
//     const userEnterprises = await prisma.userEnterprise.findMany({
//       include: {
//         posts: true,
//         comments: true,
//       },
//     });

//     res.json(userEnterprises);
//   } catch (error) {
//     console.error('Error fetching user enterprises:', error);
//     res.status(500).json({ error: 'Error fetching user enterprises' });
//   }
// };
export const getUserEnterprises = async (req: Request, res: Response) => {
  try {
    const userEnterprises = await prisma.userEnterprise.findMany({
      include: {
        offerts: true,
        posts: true,
        comments: true,
      },
    });

    res.json(userEnterprises);
  } catch (error) {
    console.error('Error fetching user enterprises:', error);
    res.status(500).json({ error: 'Error fetching user enterprises' });
  }
};