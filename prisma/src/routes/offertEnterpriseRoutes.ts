import { Router, Request, Response, NextFunction } from 'express';
import { createOffer, getAllOffersByUser, updateOfferStatus, getOfferById, updateOffer, deleteOffer, getCategories } from '../controllers/offertController';
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

// Ruta para actualizar el estado de una oferta
router.patch('/update_status/:id', authenticateToken, (req: Request, res: Response, next: NextFunction) => {
  updateOfferStatus(req, res).catch(next);
});

// Ruta para obtener una oferta por ID
router.get('/:id', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  const offerId = req.params.id;
  const offer = await getOfferById(offerId);
  res.json(offer);
});

// Ruta para actualizar una oferta
router.put('/update/:id', authenticateToken, (req: Request, res: Response, next: NextFunction) => {
  updateOffer(req, res).catch(next);
});

// Ruta para eliminar una oferta
router.delete('/delete/:id', authenticateToken, (req: Request, res: Response, next: NextFunction) => {
  deleteOffer(req, res).catch(next);
});

// router.get('/categories', authenticateToken, (req: Request, res: Response, next: NextFunction) => {
  router.get('/categories', (req: Request, res: Response, next: NextFunction) => {
    getCategories(req, res).catch(next);
});

export default router;
