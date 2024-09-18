const mongoose = require('mongoose');
const slugify = require('slugify'); // SLUGIFY
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    jobCount: {
        type: Number,
        default: 0
    },
    slug: {
        type: String,
        lowercase: true,
        unique: true
    },
    image: {
        type: String
    },
    subcategories: [String]
});

// MIDDLEWARE PARA GENERAR SLUG CON TOKEN ALEATORIO
categorySchema.pre('save', function (next) {
    if (!this.slug) {
        const randomToken = Math.random().toString(36).substring(2, 8); // TOKEN 6 CARACTERS
        this.slug = `${slugify(this.name, { lower: true })}-${randomToken}`;
    }
    next();
});

module.exports = mongoose.model('Categorys', categorySchema);
