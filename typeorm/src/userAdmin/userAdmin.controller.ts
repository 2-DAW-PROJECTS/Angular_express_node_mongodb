import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { UserAdminService } from './userAdmin.service';
import { CreateUserAdminDto, LoginUserDto } from './dto';
import { validate } from 'class-validator';
import argon2 from 'argon2';

const userAdminService = new UserAdminService();

export const createUserAdmin = async (req: Request, res: Response) => {
    const createUserDto = new CreateUserAdminDto();
    Object.assign(createUserDto, req.body);
    
    // console.log('Received body:', req.body);

    // Validamos los datos en el DTO
    const errors = await validate(createUserDto);
    if (errors.length > 0) {
        return res.status(400).json(errors);
    }

    try {
        if (createUserDto.password) {
            createUserDto.password = await argon2.hash(createUserDto.password);
        } else {
            return res.status(400).json({ message: 'La contraseña es requerida' });
        }

        const newUser = await userAdminService.createUser(createUserDto);
        res.json(newUser);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el usuario', error });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    const loginUserDto = new LoginUserDto();
    Object.assign(loginUserDto, req.body);

    const errors = await validate(loginUserDto);
    if (errors.length > 0) {
        return res.status(400).json(errors);
    }

    const user = await userAdminService.getUserByEmail(loginUserDto.email);
    if (user && await argon2.verify(user.password, loginUserDto.password)) {
        const token = jwt.sign(
            { userId: user._id, email: user.email, userType: user.userType },
            process.env.ACCESS_TOKEN_SECRET as string,
            { expiresIn: '1h' }
        );
        res.json({ message: 'Login exitoso', admin_access_token: token });
    } else {
        res.status(401).json({ message: 'Credenciales inválidas' });
    }
};

export const getAllUserAdmins = async (req: Request, res: Response) => {
    try {
        const users = await userAdminService.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios', error });
    }
};

export const getUserAdminById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await userAdminService.getUserById(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el usuario', error });
    }
};
