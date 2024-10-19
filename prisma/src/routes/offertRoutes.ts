import { Router } from 'express';
import { createOffert, getOfferts } from '../controllers/offertController';

const router = Router();

router.post('/', createOffert);
router.get('/', getOfferts);

export default router;
