const User = require('../models/users.model');

const checkTokenBlacklist = async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return next();

    const token = authHeader.split(' ')[1];

    const user = await User.findOne({ usedRefreshTokens: token });
    if (user) {
        return res.status(401).json({ message: 'Token has been revoked' });
    }

    next();
};

module.exports = checkTokenBlacklist;
