const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: { 
        type: String 
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        index: true
    },
    bio: {
        type: String,
        default: ""
    },
    usedRefreshTokens: [{ 
        type: String 
    }],
    city: {
        type: String,
        default: ""
    },
    aboutMe: {
        type: String,
        default: ""
    },
    skills: {
        type: [String],
        default: []
    },
    image: {
        type: String,
        default: "https://static.productionready.io/images/smiley-cyrus.jpg"
    },
    favouriteOfferts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offert'  // Se hace referencia a las ofertas de empleo
    }],
    followingUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'  // Se sigue a otros usuarios
    }]
}, {
    timestamps: true
});

userSchema.plugin(uniqueValidator);

// Método para representar al usuario
userSchema.methods.toUserResponse = function() {
    return {
        username: this.username,
        email: this.email,
        bio: this.bio,
        image: this.image,
        city: this.city,
        aboutMe: this.aboutMe,
        skills: this.skills,
        refreshToken: this.refreshToken
    };
};

// Métodos para manejar el sistema de followers
userSchema.methods.isFollowing = function(id) {
    const idStr = id.toString();
    return this.followingUsers.some(followingUser => followingUser.toString() === idStr);
};

userSchema.methods.follow = function(id) {
    if (!this.isFollowing(id)) {
        this.followingUsers.push(id);
    }
    return this.save();
};

userSchema.methods.unfollow = function(id) {
    const index = this.followingUsers.indexOf(id);
    if (index !== -1) {
        this.followingUsers.splice(index, 1);
    }
    return this.save();
};

// Métodos para manejar el sistema de favoritos (likes a ofertas)
userSchema.methods.isFavourite = function(offertId) {
    const idStr = offertId.toString();
    return this.favouriteOfferts.some(offert => offert.toString() === idStr);
};

userSchema.methods.favorite = function(offertId) {
    if (!this.isFavourite(offertId)) {
        this.favouriteOfferts.push(offertId);
    }
    return this.save();
};

userSchema.methods.unfavorite = function(offertId) {
    const index = this.favouriteOfferts.indexOf(offertId);
    if (index !== -1) {
        this.favouriteOfferts.splice(index, 1);
    }
    return this.save();
};

module.exports = mongoose.model('User', userSchema);
