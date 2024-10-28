import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET || 'AndIfWeDieWeWillBeAbleToSay_ItWasFun';

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => { 
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next({ status: 401, message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload; 
    req.user = { userId: decoded.userId };
    next(); 
  } catch (error) {
    return next({ status: 403, message: 'Invalid token' });
  }
};

