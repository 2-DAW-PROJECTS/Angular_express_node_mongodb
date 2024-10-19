import { Router, Request, Response, NextFunction } from 'express';
import { createUserEnterprise, getUserEnterprises, getUserEnterpriseByEmail, updateUserEnterprise } from '../controllers/userController';

const router = Router();

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  createUserEnterprise(req, res).catch(next);
});

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  getUserEnterprises(req, res).catch(next);
});

router.get('/:email', (req: Request, res: Response, next: NextFunction) => {
  getUserEnterpriseByEmail(req, res).catch(next);
});

router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  updateUserEnterprise(req, res).catch(next);
});

export default router;
