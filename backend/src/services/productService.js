const slugify = require('slugify');
const Product = require('../models/productModel');
const createError = require('http-errors');

const createProduct = async (productData, image) => {
    if (image && image.size > 1024 * 1024 * 2) {
        throw createError(400, 'File size must be between 2 MB');
    }

    if (image) {
        productData.image = image;
    }

    const productExists = await Product.exists({ name: productData.name });

    if (productExists) {
        throw createError(409, 'Product with this name already exists.');
    }

    const product = await Product.create({ ...productData, slug: slugify(productData.name) });

    return product;
}

const getProducts = async () => {
    return await Product.find({}).populate('category');
}

module.exports = { createProduct, getProducts };