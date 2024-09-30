const userController = require('../controllers/user.controller.js');
const verifyJWT = require('../middleware/verifyJWT.js');


module.exports = (app) => {

    // User registration
    router.post('/users', userController.register);

    // User login
    router.post('/users/login', userController.login);

    // Get user profile
    router.get('/profile', verifyJWT, userController.getCurrentUser);

    // Update user profile
    router.put('/user', verifyJWT, userController.updateUser);

    // // Delete user account
    // router.delete('/account', authMiddleware, userController.deleteAccount);

    // // Password reset request
    // router.post('/reset-password', userController.requestPasswordReset);

    // // Password reset confirmation
    // router.post('/reset-password/:token', userController.resetPassword);

};
