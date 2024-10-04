const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    //     if (err) {
    //         return res.status(403).json({ message: 'Forbidden' });
    //     }
    //     req.userId = decoded.user.id;
    //     req.userEmail = decoded.user.email;
    //     req.userHashedPwd = decoded.user.password;
    //     next();
    // });
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.userId = decoded.user.id;
        req.userEmail = decoded.user.email;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};

module.exports = verifyJWT;
