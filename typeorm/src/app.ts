import express from 'express';
import cors from 'cors';
import { connectDatabase } from './config/database';
import postRoutes from './Post/Post.routes';
import userAdminRoutes from './userAdmin/userAdmin.routes';
import userEnterpriseRoutes from './userEnterprise/userEnterprise.routes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Configuración de CORS
app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

// Conectar a la base de datos antes de configurar las rutas
connectDatabase().then(() => {
    // Configuración de las rutas una vez la base de datos esté conectada
    app.use('/posts', postRoutes);
    app.use('/userAdmin', userAdminRoutes);
    app.use('/userEnterprise', userEnterpriseRoutes);

    // Iniciar el servidor
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
