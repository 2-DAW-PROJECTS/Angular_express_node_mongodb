// userAdmin.routes.ts
import { Router } from 'express';
import { createUserAdmin, loginUser, getAllUserAdmins, getUserAdminById, getCurrentUser } from './userAdmin.controller';
import { verifyJWT } from '../middlewares/verifyJWT';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// Rutas públicas
router.post('/register', asyncHandler(createUserAdmin));
router.post('/login', asyncHandler(loginUser));

// Rutas protegidas
router.use(verifyJWT);

router.get('/current_user', asyncHandler(getCurrentUser));
router.get('/get_allusers', asyncHandler(getAllUserAdmins));
router.get('/get_user/:id', asyncHandler(getUserAdminById));

export default router;
