const Category = require('../models/categorys.model.js');
const asyncHandler = require('express-async-handler');

// CREATE NUEVA CATEGORY
const createCategorys = asyncHandler(async (req, res) => {
    const categoryData = {
        name: req.body.name || null,
        description: req.body.description || null,
        parentCategory: req.body.parentCategory || [],
        isActive: req.body.isActive || false,
        jobCount: req.body.jobCount || 0,
        image: req.body.image || null,
        slug: req.body.slug || null
    };

    const newCategory = new Category(categoryData);
    await newCategory.save();

    return res.status(201).json(newCategory);
});

// FIND ALL CATEGORYS
const findAllCategorys = asyncHandler(async (req, res) => {
    let query = {};
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const title = req.query.title || '';

    if (title) {
        query.title = { $regex: new RegExp(title, 'i') };
    }

    const categorys = await Category.find(query).limit(limit).skip(offset);
    const categoryCount = await Category.countDocuments(query);

    return res.status(200).json({ categorys, count: categoryCount });
});

// FIND ONE CATEGORYS
const findOneCategorys = asyncHandler(async (req, res) => {
    const category = await category.findOne({ slug: req.params.slug });

    if (!category) {
        return res.status(404).json({ message: 'Category not found' });
    }

    return res.status(200).json(category);
});

// DELETE ONE CATEGORYS
const deleteOneCategorys = asyncHandler(async (req, res) => {
    const result = await Category.deleteOne({ slug: req.params.slug });

    if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Category not found' });
    }

    return res.status(200).json({ message: 'Category deleted' });
});

// UPDATE CATEGORYS
const updateCategorys = asyncHandler(async (req, res) => {
    const updatedCategory = await Category.findOneAndUpdate(
        { slug: req.params.slug },
        req.body,
        { new: true, runValidators: true }
    );

    if (!updatedCategory) {
        return res.status(404).json({ message: 'Category not found' });
    }

    return res.status(200).json(updatedCategory);
});

// EXPORT MODULE
module.exports = {
    createCategorys,
    findAllCategorys,
    findOneCategorys,
    deleteOneCategorys,
    updateCategorys
};
