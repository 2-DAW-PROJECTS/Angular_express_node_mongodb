import { Router, Request, Response, NextFunction } from 'express';
import { createUserEnterprise, getUserEnterprises } from '../controllers/userEnterpriseController';

const router = Router();

router.post('/register', (req: Request, res: Response, next: NextFunction) => {
  createUserEnterprise(req, res).catch(next);
});

router.get('/get_allusers', (req: Request, res: Response, next: NextFunction) => {
  getUserEnterprises(req, res).catch(next);
});

export default router;
