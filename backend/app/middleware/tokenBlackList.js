const User = require('../models/users.model');

const checkTokenBlacklist = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return next();

  const token = authHeader.split(' ')[1];

  const user = await User.findOne({ 
    $or: [
      { expiredRefreshTokens: token },
      { refreshToken: token }
    ]
  });

  if (user && user.expiredRefreshTokens.includes(token)) {
    return res.status(401).json({ message: 'Token has been revoked' });
  }

  next();
};

module.exports = checkTokenBlacklist;
