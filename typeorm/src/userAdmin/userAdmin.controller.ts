// src/userAdmin/userAdmin.controller.ts
import { Request, Response } from 'express';
import { UserAdminService } from './userAdmin.service';
import { CreateUserAdminDto, LoginUserDto, UpdateUserDto } from './dto';
import { validate } from 'class-validator';

const userAdminService = new UserAdminService();

    // Crear un nuevo usuario
    export const createUserAdmin = async (req: Request, res: Response) => {
        const createUserDto = new CreateUserAdminDto();
        Object.assign(createUserDto, req.body);
    
        const errors = await validate(createUserDto);
        if (errors.length > 0) {
            return res.status(400).json(errors);
        }
    
        const newUser = await userAdminService.createUser(createUserDto);
        res.json(newUser);
    };


    export const loginUser = async (req: Request, res: Response) => {
        const loginUserDto = new LoginUserDto();
        Object.assign(loginUserDto, req.body);
    
        const errors = await validate(loginUserDto);
        if (errors.length > 0) {
            return res.status(400).json(errors);
        }
    
        const user = await userAdminService.loginUser(loginUserDto);
        res.json(user);
    };

    // Obtener todos los usuarios
    export const getAllUserAdmins = async (req: Request, res: Response) => {
        try {
            const users = await userAdminService.getAllUsers();
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los usuarios', error });
        }
    };

    // Obtener un usuario por ID
    export const getUserAdminById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const user = await userAdminService.getUserById(id);
            // console.log(id);
            // console.log(user);
            if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el usuario', error });
        }
    };

    // Actualizar un usuario por ID
    export const updateUserAdmin = async (req: Request, res: Response) => {
        const updateUserDto = new UpdateUserDto();
        Object.assign(updateUserDto, req.body);
    
        const errors = await validate(updateUserDto);
        if (errors.length > 0) {
            return res.status(400).json(errors);
        }
    
        const updatedUser = await userAdminService.updateUser(req.params.id, updateUserDto);
        res.json(updatedUser);
    };

    // Eliminar un usuario por ID
    export const deleteUserAdmin = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await userAdminService.deleteUser(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar el usuario', error });
        }
    };

