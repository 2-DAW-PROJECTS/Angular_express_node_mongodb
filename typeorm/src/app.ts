import express from 'express';
import cors from 'cors';
import { connectDatabase } from './config/database';
import postRoutes from './Post/Post.routes';
import userAdminRoutes from './userAdmin/userAdmin.routes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de CORS
app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

app.use('/posts', postRoutes);
app.use('/userAdmin', userAdminRoutes);

connectDatabase().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
