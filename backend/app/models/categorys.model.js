const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: String,
    description: String,
    parentCategory: [String],
    isActive: Boolean,
    jobCount: Number,
    slug: { type: String, unique: true, required: true }, // SLUG
    image: String
});

module.exports = mongoose.model('Categorys', categorySchema);
