const mongoose = require('mongoose');
const User = require("./users.model");  // Cambiado a 'users.model'

const commentSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    offert: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offert'
    }
}, {
    timestamps: true
});

commentSchema.methods.toCommentResponse = async function (user) {
    const authorObj = await User.findById(this.author).exec();
    // console.log("Author Object:", authorObj); // Agregar este log para depuración
    return {
        id: this._id,
        body: this.body,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        author: authorObj ? authorObj.toProfileJSON() : null 
    };
};


module.exports = mongoose.model('Comment', commentSchema);
