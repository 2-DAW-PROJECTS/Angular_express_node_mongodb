import { Router, Request, Response, NextFunction } from 'express';
import { getCategories } from '../controllers/categorysController';

const router = Router();

// Ruta para obtener todas las categorías
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  getCategories(req, res).catch(next);
});


export default router;
