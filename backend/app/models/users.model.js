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
    favouriteArticles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
    }],
    followingUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

userSchema.plugin(uniqueValidator);

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
    }
};

module.exports = mongoose.model('User', userSchema);
