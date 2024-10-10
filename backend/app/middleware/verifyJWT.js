const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    // console.log("Auth Header:", authHeader); // Imprime el encabezado
    if (!authHeader || (!authHeader.startsWith('Bearer ') && !authHeader.startsWith('Token '))) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    // console.log("Token:", token); // Imprime el token

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            // console.log('JWT verification error:', err); // Agregar este console log para más detalles
            return res.status(403).json({ message: 'Forbidden - Invalid token', error: err.message });
        }
    
        req.userId = decoded.user.id;
        req.userEmail = decoded.user.email;
    
        next();
    });
    
};



module.exports = verifyJWT;
