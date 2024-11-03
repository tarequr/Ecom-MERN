const slugify = require('slugify');
const Category = require('../models/categoryModel');
const { successResponse } = require('../helpers/responseHandler');
const createError = require('http-errors');
const { createProduct } = require('../services/productService');
const Product = require('../models/productModel');

const handleCreateProduct = async (req, res, next) => {
    try {
        const { name, description, price, quantity, sold, shipping, category } = req.body;

        // const image = req.file;

        // if (!image) {
        //     throw createError(400, 'Image field is required.')
        // }

        // if (image.size > 1024 * 1024 * 2) {
        //     throw createError(400, 'File size must be between 2 MB')
        // }

        // const imageBufferString = image.buffer.toString('base64');

        // anoher way
        const image = req.file?.path;

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

        // const newCategory = await createProduct(name);

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

        return successResponse(res, {
            statusCode: 201,
            message: 'Product created successfully!',
            payload: { product }
        });
    } catch (error) {   
        next(error);
    }
}


module.exports = { handleCreateProduct };