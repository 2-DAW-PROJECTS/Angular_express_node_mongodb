// C:\Users\3eias\Documents\2ºDAW\SERVER\INFOJOBS_Angular_Express_Node_MongoDB\prisma\src\routes\userEnterpriseRoutes.ts
import { Router, Request, Response, NextFunction } from 'express';
import { createUserEnterprise, getUserEnterprises, loginUserEnterprise, getCurrentUser } from '../controllers/userEnterpriseController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// REGISTER
router.post('/register', (req: Request, res: Response, next: NextFunction) => {
  createUserEnterprise(req, res).catch(next);
});

// LOGIN
router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  loginUserEnterprise(req, res).catch(next);
});

// Obtener todos los usuarios
router.get('/get_allusers', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  getUserEnterprises(req, res).catch(next);
});

// Obtener el usuario actual
router.get('/current_user', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  getCurrentUser(req, res).catch(next);
});

export default router;
