const User = require('../models/users.model.js');
const asyncHandler = require('express-async-handler');
const argon2 = require('argon2');


// @desc registration for a user
// @route POST /api/users
// @access Public
// @required fields {email, username, password}
// @return User
const registerUser = asyncHandler(async (req, res) => {
    const { user } = req.body;

    // confirm data
    if (!user || !user.email || !user.username || !user.password) {
        return res.status(400).json({message: "All fields are required"});
    }


    //
    //
    // Check if email or username already exists
    const existingUser = await User.find({ $or: [{ email: user.email }, { username: user.username }] });
    if (existingUser.length > 0) {
        return res.status(422).json({message: "The email or username is already taken"});
    }
    //
    //


    // hash password
    const hashedPwd = await argon2.hash(user.password); // salt rounds

    const userObject = {
        "username": user.username,
        "password": hashedPwd,
        "email": user.email
    };

    const createdUser = await User.create(userObject);

    if (createdUser) { // user object created successfully
        res.status(201).json({
            user: createdUser.toUserResponse()
        })
    } else {
        res.status(422).json({
            errors: {
                body: "Unable to register a user"
            }
        });
    }
});

// @desc get currently logged-in user
// @route GET /api/user
// @access Private
// @return User
const getCurrentUser = asyncHandler(async (req, res) => {
    const email = req.userEmail;

    const user = await User.findOne({ email }).exec();

    if (!user) {
        return res.status(404).json({ message: "User Not Found" });
    }

    res.status(200).json({
        user: user.toUserResponse()
    });
});

// @desc login for a user
// @route POST /api/users/login
// @access Public
// @required fields {email, password}
// @return User
const userLogin = asyncHandler(async (req, res) => {
    const { user } = req.body;

    if (!user || !user.email || !user.password) {
        return res.status(400).json({message: "All fields are required"});
    }

    const loginUser = await User.findOne({ email: user.email }).exec();

    if (!loginUser) {
        return res.status(404).json({message: "User Not Found"});
    }

    const match = await argon2.verify(loginUser.password, user.password);


    if (!match) return res.status(401).json({ message: 'Unauthorized: Wrong password' })

    const accessToken = jwt.sign({ user: { id: loginUser._id, email: loginUser.email } }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ user: { id: loginUser._id } }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    
    loginUser.refreshToken = refreshToken;
    await loginUser.save();

    res.status(200).json({
        user: loginUser.toUserResponse(),
        accessToken,
        refreshToken
    });

});



const refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) return res.status(401).json({ message: 'No refresh token provided' });

    try {
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        console.log(payload);

        const user = await User.findById(payload.user.id);

        console.log(user);

        

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        const newAccessToken = jwt.sign({ user: { id: user._id, email: user.email } }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

        res.json({ accessToken: newAccessToken });
    } catch (err) {
        res.status(403).json({ message: 'Invalid refresh token' });
    }
});






// @desc update currently logged-in user
// Warning: if password or email is updated, client-side must update the token
// @route PUT /api/user
// @access Private
// @return User
const updateUser = asyncHandler(async (req, res) => {
    const { user } = req.body;

    // confirm data
    if (!user) {
        return res.status(400).json({message: "Required a User object"});
    }

    const email = req.userEmail;

    const target = await User.findOne({ email }).exec();

    if (user.email) {
        target.email = user.email;
    }
    if (user.username) {
        target.username = user.username;
    }
    if (user.password) {
        const hashedPwd = await argon2.hash(user.password);
        target.password = hashedPwd;
    }
    if (typeof user.image !== 'undefined') {
        target.image = user.image;
    }
    if (typeof user.bio !== 'undefined') {
        target.bio = user.bio;
    }
    await target.save();

    return res.status(200).json({
        user: target.toUserResponse()
    });

});

module.exports = {
    registerUser,
    getCurrentUser,
    userLogin,
    updateUser,
    refreshToken
}
