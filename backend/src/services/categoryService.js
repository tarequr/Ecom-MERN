const slugify = require('slugify');
const Category = require('../models/categoryModel');

const createCategory = async (req) => {
    const { name } = req.body;
    const newCategory = await Category.create({ name: name, slug: slugify(name) });
    return newCategory;
}

const getCategories = async (req) => {
    return await Category.find({}).select('name slug').lean();
}

module.exports = { createCategory, getCategories };