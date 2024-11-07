// src/config/database.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { UserEnterprise } from '../userEnterprise/userEnterprise.entity';
import { UserAdmin } from '../userAdmin/userAdmin.entity';

dotenv.config();

export const AppDataSource = new DataSource({
    type: process.env.DB_TYPE as any,
    url: process.env.DATABASE_URL,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    entities: [UserEnterprise, UserAdmin],
    synchronize: true,
});

export const connectDatabase = async () => {
    try {
        await AppDataSource.initialize();
        console.log('Database connected');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};
