import { AppDataSource } from '../config/database';  // Asegúrate de importar AppDataSource
import { UserEnterprise } from './userEnterprise.entity';  // Asegúrate de que la ruta sea correcta
import { ObjectId } from 'mongodb';  // Importa ObjectId

export class UserEnterpriseService {

    private userEnterpriseRepository = AppDataSource.getMongoRepository(UserEnterprise);

    // Obtener todos los usuarios de empresa
    async getAllUsers(): Promise<UserEnterprise[]> {
        return await this.userEnterpriseRepository.find();
    }

    // Obtener un usuario de empresa por ID
    async getUserById(id: string): Promise<UserEnterprise | null> {
        return await this.userEnterpriseRepository.findOne({ where: { _id: new ObjectId(id) } });
    }

    // Actualizar el estado (activo/inactivo) de un usuario de empresa
    async updateUserStatus(id: string, isActive: boolean): Promise<UserEnterprise | null> {
        const user = await this.getUserById(id);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        user.isActive = isActive;
        await this.userEnterpriseRepository.save(user);
        return user;
    }

    // Eliminar un usuario de empresa
    async deleteUser(id: string): Promise<void> {
        const user = await this.getUserById(id);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        await this.userEnterpriseRepository.remove(user);  // Eliminar el usuario
    }
}
