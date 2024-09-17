const Offert = require('../models/offerts.model.js');
const asyncHandler = require('express-async-handler');

// CREATE NUEVA OFFERT
const createOffert = asyncHandler(async (req, res) => {
    const offertData = {
        title: req.body.title || null,
        company: req.body.company || null,
        location: req.body.location || null,
        description: req.body.description || null,
        requirements: req.body.requirements || [],
        salary: req.body.salary || 0,
        postedDate: req.body.postedDate || new Date(), // Fecha de publicación atomatica
        slug: req.body.slug || null
    };

    const newOffert = new Offert(offertData);
    await newOffert.save();

    return res.status(201).json(newOffert);
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

// EXPORT MODULE
module.exports = {
    createOffert,
    findAllOfferts,
    findOneOffert,
    deleteOneOffert,
    updateOffert
};
