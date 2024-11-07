import { Router } from 'express';
import { getAllUserEnterprises, updateUserStatus, deleteUser } from './userEnterprise.controller';
import { verifyJWT } from '../middlewares/verifyJWT';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// Rutas protegidas
router.use(verifyJWT);

router.get('/get_all', asyncHandler(getAllUserEnterprises));  // Obtener todos los usuarios de empresa
router.put('/update-status', asyncHandler(updateUserStatus));  // Actualizar estado de usuario
router.delete('/delete-user/:id', asyncHandler(deleteUser));  // Eliminar usuario de empresa

export default router;
