const mongoose = require('mongoose');
const slugify = require('slugify'); // SLUGIFY
const { Schema } = mongoose;
const User = require('./users.model'); // Asegúrate de que esta ruta sea correcta

const offertSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    company_slug: {
        type: String, // Campo para almacenar el slug de la empresa
        required: true
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    requirements: [String],
    salary: {
        type: Number,
        required: true
    },
    postedDate: {
        type: Date,
        default: Date.now
    },
    slug: {
        type: String,
        lowercase: true,
        unique: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categorys', // Asegúrate de que este modelo exista
        required: true
    },
    image: {
        type: String,
        required: true
    },
    categorySlug: {
        type: String,
        lowercase: true,
        required: true
    },
    favouritesCount: {
        type: Number,
        default: 0
    },
    favorites: [{ // Nuevo campo para almacenar los IDs de usuarios que han dado like
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Asegúrate de que este modelo exista
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, {
    timestamps: true // Agrega timestamps (createdAt y updatedAt)
});

// MIDDLEWARE PARA GENERAR SLUG CON TOKEN ALEATORIO
offertSchema.pre('save', async function (next) {
    if (!this.slug) {
        const randomToken = Math.random().toString(36).substring(2, 8); // TOKEN 6 CARACTERS
        this.slug = `${slugify(this.title, { lower: true })}-${randomToken}`;
    }

    // Obtener el slug de la categoría, si no está ya establecido.
    if (this.category && !this.categorySlug) {
        try {
            const category = await mongoose.model('Categorys').findById(this.category).exec();
            if (category) {
                this.categorySlug = category.slug;
            } else {
                return next(new Error('Categoría no encontrada'));
            }
        } catch (error) {
            return next(new Error('Error al buscar la categoría: ' + error.message));
        }
    }

    next();
});

// Método para actualizar el contador de favoritos (likes)
offertSchema.methods.updateFavoriteCount = async function () {
    // No es necesario recibir User aquí, ya que simplemente contamos los favoritos
    this.favouritesCount = this.favorites.length; // Actualiza el contador de favoritos basado en el arreglo de IDs
    return this.save();
};

// Método para generar la respuesta de la oferta
offertSchema.methods.toOffertResponse = async function (user) {
    const authorObj = await User.findById(this.author).exec();
    return {
        slug: this.slug,
        title: this.title,
        description: this.description,
        company: this.company,
        location: this.location,
        requirements: this.requirements,
        salary: this.salary,
        image: this.image,
        postedDate: this.postedDate,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        favoritesCount: this.favouritesCount,
        favorited: user ? this.favorites.includes(user._id) : false, // Usamos user._id para comprobar si es un favorito
        comments: this.comments,
        author: authorObj ? authorObj.toProfileJSON(user) : null // Relacionado al autor de la oferta, si existe
    };
};

// Método para añadir un comentario
offertSchema.methods.addComment = function (commentId) {
    if (this.comments.indexOf(commentId) === -1) {
        this.comments.push(commentId);
    }
    return this.save();
};

// Método para eliminar un comentario
offertSchema.methods.removeComment = function (commentId) {
    const index = this.comments.indexOf(commentId);
    if (index !== -1) {
        this.comments.splice(index, 1);
    }
    return this.save();
};

module.exports = mongoose.model('Offert', offertSchema);
