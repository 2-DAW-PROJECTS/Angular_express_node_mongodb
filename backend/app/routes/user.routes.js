const userController = require('../controllers/users.controller.js');
const verifyJWT = require('../middleware/verifyJWT.js');
const checkTokenBlacklist = require('../middleware/tokenBlackList.js');

module.exports = (app) => {
    // User registration
    app.post('/users', userController.registerUser);

    // User login
    app.post('/users/login', userController.userLogin);

    // Get user profile
    app.get('/profile', checkTokenBlacklist, verifyJWT, userController.getCurrentUser);

    // Get current user details at /user
    app.get('/user', checkTokenBlacklist, verifyJWT, userController.getCurrentUser);

    // Update user profile
    app.put('/user', checkTokenBlacklist, verifyJWT, userController.updateUser);

    // Refresh token
    app.post('/refresh-token', userController.refreshToken);

    // Logout
    app.post('/users/logout', userController.logoutUser);
};
