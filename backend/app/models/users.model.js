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
    expiredRefreshTokens: [{ 
        type: String,
        default: [] 
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
        ref: 'Offert'
    }],
    followingUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    }],
    followers: [{  
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

userSchema.plugin(uniqueValidator);

// Método para representar al usuario
userSchema.methods.toUserResponse = function() {
    return {
        // id: this._id,         
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

// Método para representar al usuario en comentarios
userSchema.methods.toProfileJSON = function() {
    return {
        id: this._id,         
        username: this.username,
        email: this.email,
        bio: this.bio,
        image: this.image,
        city: this.city,
        aboutMe: this.aboutMe,
        skills: this.skills,
    };
};

// Métodos para manejar el sistema de followers
userSchema.methods.isFollowing = function(id) {
    const idStr = id.toString();
    return this.followingUsers.some(followingUser => followingUser.toString() === idStr);
};

userSchema.methods.follow = async function(id) {
    if (!this.isFollowing(id)) {
        this.followingUsers.push(id);
        const followedUser = await mongoose.model('User').findById(id);
        followedUser.followers.push(this._id); 
        await followedUser.save();
    }
    return this.save();
};

userSchema.methods.unfollow = async function(id) {
    const index = this.followingUsers.indexOf(id);
    
    if (index !== -1) {
        this.followingUsers.splice(index, 1);

        const unfollowedUser = await mongoose.model('User').findById(id);
        
        if (unfollowedUser) {
            const followerIndex = unfollowedUser.followers.indexOf(this._id);

            if (followerIndex !== -1) {
                unfollowedUser.followers.splice(followerIndex, 1);
                await unfollowedUser.save();  
            }
        }
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
