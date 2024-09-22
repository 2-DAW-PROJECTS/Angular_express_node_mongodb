const mongoose = require('mongoose');
const slugify = require('slugify'); // SLUGIFY
const { Schema } = mongoose;

const offertSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    company: {
        type: String,
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
        ref: 'Categorys',
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
    }
});

// MIDDLEWARE PARA GENERAR SLUG CON TOKEN ALEATORIO
offertSchema.pre('save', async function (next) {
    if (!this.slug) {
        const randomToken = Math.random().toString(36).substring(2, 8); // TOKEN 6 CARACTERS
        this.slug = `${slugify(this.title, { lower: true })}-${randomToken}`;
    }

    // Obtener el slug de la categoría, si no está ya establecido.
    if (this.category && !this.categorySlug) {
        const category = await mongoose.model('Categorys').findById(this.category).exec();
        if (category) {
            this.categorySlug = category.slug;
        } else {
            return next(new Error('Categoría no encontrada'));
        }
    }

    next();
});

module.exports = mongoose.model('Offert', offertSchema);
