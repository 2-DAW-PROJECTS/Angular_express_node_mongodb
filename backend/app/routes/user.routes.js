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

    // Ruta para seguir a un usuario
    app.post('/users/:username/follow', checkTokenBlacklist, verifyJWT, userController.followUser);

    // Ruta para dejar de seguir a un usuario
    app.delete('/users/:username/unfollow', checkTokenBlacklist, verifyJWT, userController.unfollowUser);

    // Update user profile
    app.put('/user', checkTokenBlacklist, verifyJWT, userController.updateUser);

    app.get('/users/know_users', checkTokenBlacklist, verifyJWT, userController.getAllUsers);

    app.get('/users/myfollowers', checkTokenBlacklist, verifyJWT, userController.getMyFollowers);

    app.delete('/users/follower/:followerId', checkTokenBlacklist, verifyJWT, userController.removeFollower);

    // Refresh token
    app.post('/refresh-token', userController.refreshToken);

    // Logout
    app.post('/users/logout', userController.logoutUser);
};
