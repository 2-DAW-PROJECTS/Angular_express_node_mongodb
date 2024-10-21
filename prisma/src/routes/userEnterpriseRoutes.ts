import { Router, Request, Response, NextFunction } from 'express';
import { createUserEnterprise, getUserEnterprises } from '../controllers/userEnterpriseController';

const router = Router();

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  createUserEnterprise(req, res).catch(next);
});

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  getUserEnterprises(req, res).catch(next);
});

export default router;
