const slugify = require('slugify');
const Product = require('../models/productModel');
const createError = require('http-errors');

const createProduct = async (req) => {
    const { name } = req.body;
    const newProduct = await Product.create({ name: name, slug: slugify(name) });
    return newProduct;
}

module.exports = { createProduct };