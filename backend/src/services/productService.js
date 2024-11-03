const slugify = require('slugify');
const Product = require('../models/productModel');
const createError = require('http-errors');

const createProduct = async (productData) => {
    const { name, description, price, quantity, sold, shipping, category, image } = productData;

    if (!image) {
        throw createError(400, 'Image file is required');
    }

    if (image && image.size > 1024 * 1024 * 2) {
        throw createError(400, 'File size must be between 2 MB');
    }

    const productExists = await Product.exists({ name: name });

    if (productExists) {
        throw createError(409, 'Product with this name already exists.');
    }

    //create product
    const product = await Product.create({
        name: name,
        slug: slugify(name),
        description: description,
        price: price,
        quantity: quantity,
        sold: sold,
        shipping: shipping,
        image: image,
        category: category
    });

    return product;
}

module.exports = { createProduct };