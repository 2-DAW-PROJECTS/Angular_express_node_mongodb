// src/userAdmin/userAdmin.routes.ts
import { Router } from 'express';
import { createUserAdmin, loginUser, updateUserAdmin, getAllUserAdmins, getUserAdminById, deleteUserAdmin } from './userAdmin.controller';

const router = Router();

// Ruta para crear un nuevo usuario
router.post('/', (req, res, next) => {
    createUserAdmin(req, res).catch(next);
});

// Ruta para obtener todos los usuarios
router.get('/', (req, res, next) => {
    getAllUserAdmins(req, res).catch(next);
});

// Ruta para obtener un usuario por ID
router.get('/:id', (req, res, next) => {
    getUserAdminById(req, res).catch(next);
});

// Ruta para actualizar un usuario por ID
router.put('/:id', (req, res, next) => {
    updateUserAdmin(req, res).catch(next);
});

// Ruta para iniciar sesión
router.post('/login', (req, res, next) => {
    loginUser(req, res).catch(next);
});

// Ruta para eliminar un usuario por ID
router.delete('/:id', (req, res, next) => {
    deleteUserAdmin(req, res).catch(next);
});

export default router;

