const User = require('../models/users.model.js');
const asyncHandler = require('express-async-handler');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

// @desc registration for a user
// @route POST /api/users
// @access Public
// @required fields {email, username, password}
// @return User
const registerUser = asyncHandler(async (req, res) => {
    const { user } = req.body;

    // Verificar campos requeridos
    if (!user || !user.email || !user.username || !user.password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Verificar si ya existe un usuario con el mismo email o username
    const existingUser = await User.findOne({ 
        $or: [{ email: user.email }, { username: user.username }] 
    });

    if (existingUser) {
        return res.status(422).json({ message: "Email or username already taken" });
    }

    // Hashear la contraseña
    const hashedPwd = await argon2.hash(user.password);
    const userObject = {
        username: user.username,
        password: hashedPwd,
        email: user.email,
        city: "", 
        aboutMe: "",
        skills: []
    };

    // Crear el nuevo usuario
    const createdUser = await User.create(userObject);

    // Generar token JWT
    if (createdUser) {
        const token = jwt.sign(
            { user: { id: createdUser._id, email: createdUser.email } },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(201).json({
            user: createdUser.toUserResponse(), // Devuelve la respuesta del usuario
            token  // Enviar el token como respuesta
        });
    } else {
        return res.status(422).json({ errors: { body: "Unable to register a user" } });
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
        return res.status(400).json({ message: "All fields are required" });
    }

    const loginUser = await User.findOne({ email: user.email }).exec();

    if (!loginUser) {
        return res.status(404).json({ message: "User Not Found" });
    }

    // Verificar la contraseña
    const match = await argon2.verify(loginUser.password, user.password);
    if (!match) return res.status(401).json({ message: 'Unauthorized: Wrong password' });

    // Generar tokens
    const accessToken = jwt.sign(
        { user: { id: loginUser._id, email: loginUser.email } },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_INTERVAL }
    );

    const refreshToken = jwt.sign(
        { user: { id: loginUser._id } },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_INTERVAL }
    );

    // Guardar el refresh token en el usuario
    loginUser.refreshToken = refreshToken;
    loginUser.usedRefreshTokens = [];
    await loginUser.save();

    res.status(200).json({
        user: {
            ...loginUser.toUserResponse(),
            accessToken,
            refreshToken
        },
        debug: {
            userId: loginUser._id,
            email: loginUser.email,
            tokenInfo: {
                accessTokenExpiry: process.env.ACCESS_TOKEN_INTERVAL,
                refreshTokenExpiry: process.env.REFRESH_TOKEN_INTERVAL
            },
            timestamp: new Date().toISOString()
        }
    });
});


const refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) return res.status(401).json({ message: 'No refresh token provided' });

    try {
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(payload.user.id);

        if (!user || user.refreshToken !== refreshToken || user.usedRefreshTokens.includes(refreshToken)) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        const newAccessToken = jwt.sign({ user: { id: user._id, email: user.email } }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_INTERVAL });
        const newRefreshToken = jwt.sign({ user: { id: user._id } }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_INTERVAL });

        user.usedRefreshTokens.push(user.refreshToken);
        user.refreshToken = newRefreshToken;

        await user.save();

        res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
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
    console.log("Updating user with ID:", req.userId);
    const { user } = req.body;

    if (!user) {
        return res.status(400).json({ message: "Required a User object" });
    }

    const email = req.userEmail;
    const target = await User.findOne({ email }).exec();

    if (!target) {
        return res.status(404).json({ message: "User not found" });
    }

    // Update fields
    target.email = user.email || target.email;
    target.username = user.username || target.username;
    if (user.password) target.password = await argon2.hash(user.password);
    target.image = user.image || target.image;
    target.bio = user.bio || target.bio;
    target.city = user.city || target.city;
    target.aboutMe = user.aboutMe || target.aboutMe;
    if (Array.isArray(user.skills)) target.skills = user.skills;

    await target.save();

    res.status(200).json({
        user: target.toUserResponse()
    });
});

// GET PROFILE
const getProfile = asyncHandler(async (req, res) => {
    const { username } = req.params;
    const user = await User.findOne({ username }).exec();
    if (!user) return res.status(404).json({ message: "User Not Found" });
    
    const loggedInUser = req.loggedin ? await User.findById(req.userId).exec() : null;
    return res.status(200).json({ profile: user.toProfileJSON(loggedInUser) });
});

// FOLLOW ENTERPRISE
const followEnterprise = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const user = await User.findById(req.userId).exec();
    const enterprise = await Enterprise.findOne({ slug }).exec();

    if (!enterprise || !user) return res.status(404).json({ message: "User or Enterprise Not Found" });

    await user.followEnterprise(enterprise._id);
    return res.status(200).json({ profile: enterprise.toEnterpriseProfileJSON(user) });
});

// UNFOLLOW ENTERPRISE
const unfollowEnterprise = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const user = await User.findById(req.userId).exec();
    const enterprise = await Enterprise.findOne({ slug }).exec();

    if (!enterprise || !user) return res.status(404).json({ message: "User or Enterprise Not Found" });

    await user.unfollowEnterprise(enterprise._id);
    return res.status(200).json({ profile: enterprise.toEnterpriseProfileJSON(user) });
});

module.exports = {
    registerUser,
    getCurrentUser,
    userLogin,
    updateUser,
    getProfile,
    followEnterprise,
    unfollowEnterprise,
    refreshToken,
}
