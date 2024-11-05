// src/userAdmin/userAdmin.service.ts
import { AppDataSource } from '../config/database';
import { UserAdmin } from './userAdmin.entity';
import { ObjectId } from 'mongodb';
import { CreateUserAdminDto, LoginUserDto, UpdateUserDto } from './dto';


export class UserAdminService {
    private userRepository = AppDataSource.getRepository(UserAdmin);


    async createUser(userData: CreateUserAdminDto): Promise<UserAdmin> {
        const user = this.userRepository.create(userData);
        return await this.userRepository.save(user);
    }

    
    async loginUser(loginData: LoginUserDto): Promise<UserAdmin | null> {
        const user = await this.userRepository.findOne({ where: { email: loginData.email } });
        if (user && user.password === loginData.password) {
            return user;
        }
        return null;
    }


    async getAllUsers(): Promise<UserAdmin[]> {
        return await this.userRepository.find();
    }//getAllUsers


    async getUserById(id: string): Promise<UserAdmin | null> {
        // console.log("Searching for ID:", id);
        const objectId = new ObjectId(id); // Crear el ObjectId
        // console.log("ObjectId created:", objectId);
        // Busca el usuario por el campo _id
        const result = await this.userRepository.findOne({ where: { _id: objectId } });
        // console.log("Database result:", result);
        
        return result;
    }//getUserById


    async updateUser(id: string, updateData: UpdateUserDto): Promise<UserAdmin> {
        await this.userRepository.update(id, updateData);
        const updatedUser = await this.getUserById(id);
        if (!updatedUser) {
            throw new Error('User not found');
        }
        return updatedUser;
    }


    async getUserByEmail(email: string): Promise<UserAdmin | null> {
        return await this.userRepository.findOne({ where: { email } });
    }

    async deleteUser(id: string): Promise<void> {
        await this.userRepository.delete(id);
    }//deleteUser
}//class

