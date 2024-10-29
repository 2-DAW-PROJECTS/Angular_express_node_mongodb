import { Router, Request, Response, NextFunction } from 'express';
import { createOffer, getAllOffersByUser } from '../controllers/offertController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Ruta para crear una nueva oferta
router.post('/create', authenticateToken, (req: Request, res: Response, next: NextFunction) => {
  createOffer(req, res).catch(next);
});

// Ruta para obtener todas las ofertas de un usuario autenticado
router.get('/user_offers', authenticateToken, (req: Request, res: Response, next: NextFunction) => {
  getAllOffersByUser(req, res).catch(next);
});

export default router;
