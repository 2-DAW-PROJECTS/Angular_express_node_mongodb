import { Router, Request, Response, NextFunction } from 'express';
import { createUser, getUsers } from '../controllers/userController';

const router = Router();

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  createUser(req, res).catch(next);
});

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  getUsers(req, res).catch(next);
});


export default router;
