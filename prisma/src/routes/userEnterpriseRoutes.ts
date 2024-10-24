import { Router, Request, Response, NextFunction } from 'express';
import { createUserEnterprise, getUserEnterprises, loginUserEnterprise } from '../controllers/userEnterpriseController';
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

// router.get('/get_allusers', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  router.get('/get_allusers', async (req: Request, res: Response, next: NextFunction) => {
    getUserEnterprises(req, res).catch(next);  
  });
  

export default router;
