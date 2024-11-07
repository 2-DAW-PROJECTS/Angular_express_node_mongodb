import { Request, Response } from 'express';
import { UserEnterpriseService } from './userEnterprise.service';

const userEnterpriseService = new UserEnterpriseService();

// Obtener todos los usuarios de empresa
export const getAllUserEnterprises = async (req: Request, res: Response) => {
    try {
        const users = await userEnterpriseService.getAllUsers();
        res.json(users);
    } catch (error) {
        console.error('Error al obtener los usuarios de empresa:', error);
        res.status(500).json({ message: 'Error al obtener los usuarios de empresa' });
    }
};

// Actualizar el estado de un usuario de empresa
export const updateUserStatus = async (req: Request, res: Response) => {
    try {
        const { userId, isActive } = req.body;
        const user = await userEnterpriseService.updateUserStatus(userId, isActive);
        res.json({ message: 'Estado del usuario actualizado', user });
    } catch (error) {
        console.error('Error al actualizar el estado del usuario:', error);
        res.status(500).json({ message: 'Error al actualizar el estado del usuario' });
    }
};

// Eliminar un usuario de empresa
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await userEnterpriseService.deleteUser(id);
        res.json({ message: 'Usuario de empresa eliminado' });
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        res.status(500).json({ message: 'Error al eliminar el usuario' });
    }
};
