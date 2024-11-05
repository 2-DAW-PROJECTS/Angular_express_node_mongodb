// src/middlewares/verifyJWT.ts
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Clave secreta, se puede definir aquí o cargar desde variables de entorno
const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET || 'AndIfWeDieWeWillBeAbleToSay_ItWasFun';

export const verifyJWT = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return next({ status: 401, message: 'Token de autenticación requerido' });
    }

    // Verificamos el token y lo decodificamos
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return next({ status: 403, message: 'Token inválido o expirado' });
        }

        // Añadimos el userId al objeto request
        req.body.user = { userId: (decoded as JwtPayload).userId }; // Asegúrate de que userId esté en el payload
        next();
    });
};
