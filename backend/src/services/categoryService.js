const slugify = require('slugify');
const Category = require('../models/categoryModel');
const createError = require('http-errors');

const createCategory = async (req) => {
    const { name } = req.body;
    const newCategory = await Category.create({ name: name, slug: slugify(name) });
    return newCategory;
}

const getCategories = async () => {
    return await Category.find({}).select('name slug').lean();
}

const singleCategory = async (slug) => {
    const category = await Category.find({slug}).select('name slug').lean();
    return category;
}

const updateCategory = async (name, slug) => {
    const filter  = { slug };
    const updates = { $set: { name: name, slug: slugify(name) } };
    const options = { new: true };

    return await Category.findOneAndUpdate(filter, updates, options);
}

module.exports = { createCategory, getCategories, singleCategory, updateCategory };