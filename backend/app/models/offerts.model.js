const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const offertSchema = new Schema({
    title: String,
    company: String,
    location: String,
    description: String,
    requirements: [String],
    salary: Number,
    postedDate: { type: Date, default: Date.now },
    applicationDeadline: Date,
    slug: { type: String, unique: true, required: true }, // SLUG UNICO IDENTIFICATIVO
    state: String
});

module.exports = mongoose.model('Offert', offertSchema);
