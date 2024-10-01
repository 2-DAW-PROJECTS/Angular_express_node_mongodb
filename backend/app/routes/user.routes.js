const userController = require('../controllers/users.controller.js');
const verifyJWT = require('../middleware/verifyJWT.js');


module.exports = (app) => {

    // User registration
    app.post('/users', userController.registerUser);

    // User login
    app.post('/users/login', userController.userLogin);

    // Get user profile
    app.get('/profile', verifyJWT, userController.getCurrentUser);

    // Update user profile
    app.put('/user', verifyJWT, userController.updateUser);

    // // Delete user account
    // app.delete('/account', authMiddleware, userController.deleteAccount);

    // // Password reset request
    // app.post('/reset-password', userController.requestPasswordReset);

    // // Password reset confirmation
    // app.post('/reset-password/:token', userController.resetPassword);

};
