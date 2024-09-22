const Offert = require('../models/offerts.model.js');
const Category = require('../models/categorys.model.js');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify'); // SLUGIFY

// CREATE NUEVA OFFERT
const createOffert = asyncHandler(async (req, res) => {
    const { title, company, location, description, requirements, salary, image, categorySlug } = req.body;

    // Validar si la categoría existe utilizando el slug
    const categoryObj = await Category.findOne({ slug: categorySlug }).exec();
    if (!categoryObj) {
        return res.status(400).json({ error: 'Categoría no encontrada' });
    }

    // Crear nueva oferta
    const randomToken = Math.random().toString(36).substring(2, 8); // Token aleatorio de 6 caracteres
    const newOffert = new Offert({
        title,
        company,
        location,
        description,
        requirements,
        salary,
        category: categoryObj._id,
        slug: `${slugify(title, { lower: true })}-${randomToken}`,
        image, 
        categorySlug: categoryObj.slug // Establecer el slug de la categoría
    });

    const savedOffert = await newOffert.save();
    res.status(201).json(savedOffert);
});

// FIND ALL OFFERTS
const findAllOfferts = asyncHandler(async (req, res) => {
    let query = {};
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const title = req.query.title || '';

    if (title) {
        query.title = { $regex: new RegExp(title, 'i') };
    }

    const offerts = await Offert.find(query).limit(limit).skip(offset);
    const offertCount = await Offert.countDocuments(query);

    return res.status(200).json({ offerts, count: offertCount });
});

// FIND ONE OFFERT
const findOneOffert = asyncHandler(async (req, res) => {
    const offert = await Offert.findOne({ slug: req.params.slug });

    if (!offert) {
        return res.status(404).json({ message: 'Offert not found' });
    }

    return res.status(200).json(offert);
});

// DELETE ONE OFFERT
const deleteOneOffert = asyncHandler(async (req, res) => {
    const result = await Offert.deleteOne({ slug: req.params.slug });

    if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Offert not found' });
    }

    return res.status(200).json({ message: 'Offert deleted' });
});

// UPDATE OFFERT
const updateOffert = asyncHandler(async (req, res) => {
    const updatedOffert = await Offert.findOneAndUpdate(
        { slug: req.params.slug },
        req.body,
        { new: true, runValidators: true }
    );

    if (!updatedOffert) {
        return res.status(404).json({ message: 'Offert not found' });
    }

    return res.status(200).json(updatedOffert);
});

const GetOffertsByCategory = asyncHandler(async (req, res) => {
    let offset = parseInt(req.query.offset) || 0;
    let limit = parseInt(req.query.limit) || 10;
    const slug = req.params.slug; // Slug de la categoría

    // Buscar la categoría por su slug
    const category = await Category.findOne({ slug }).exec();

    if (!category) {
        return res.status(400).json({ message: "Categoría no encontrada" });
    }

    // Obtener las ofertas relacionadas con la categoría
    const offerts = await Offert.find({ category: category._id })
        .skip(offset)
        .limit(limit)
        .exec();

    const offertCount = await Offert.countDocuments({ category: category._id });

    return res.status(200).json({
        offerts,
        count: offertCount
    });
});

// EXPORT MODULE
module.exports = {
    createOffert,
    findAllOfferts,
    findOneOffert,
    deleteOneOffert,
    updateOffert,
    GetOffertsByCategory
};
