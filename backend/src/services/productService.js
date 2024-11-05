const slugify = require('slugify');
const Product = require('../models/productModel');
const createError = require('http-errors');
const { deleteImage } = require('../helpers/deleteImage');

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

const getProducts = async (page, limit) => {
    const products = await Product.find({})
        .populate('category')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

    if (!products) {
        throw createError(404, 'Products not found!'); // 404 Not Found
    }

    const productsCount = await Product.find({}).countDocuments();

    return { products, count: productsCount };
}

const singleProduct = async (slug) => {
    const product = await Product.findOne({slug}).populate('category');
    if (!product) throw createError(404, 'Product not found!');

    return product;
}

const updateProduct = async (slug) => {
    const filter  = { slug };
    const updates = { $set: { name: name, slug: slugify(name) } };
    const options = { new: true };

    return await Product.findOneAndUpdate(filter, updates, options);
}


/**
 * Deletes a product by its slug
 * @param {string} slug - The slug of the product to be deleted
 * @returns {object} - The deleted product object
 * @throws {Error} - If the product is not found.
 */
const deleteProduct = async (slug) => {
    const product = await Product.findOneAndDelete({slug});
    if (!product) throw createError(404, 'Product not found!');

    if (product.image) {
        deleteImage(product.image)
    }

    return product;
}

module.exports = { createProduct, getProducts, singleProduct, updateProduct, deleteProduct };