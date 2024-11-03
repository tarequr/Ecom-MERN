const slugify = require('slugify');
const Category = require('../models/categoryModel');
const { successResponse } = require('../helpers/responseHandler');
const createError = require('http-errors');
const { createProduct } = require('../services/productService');
const Product = require('../models/productModel');

const handleCreateProduct = async (req, res, next) => {
    try {
        // const { name, description, price, quantity, sold, shipping, category } = req.body;

        const image = req.file?.path;

        // const productData = { name, description, price, quantity, sold, shipping, category };

        // if (image) {
        //     productData.image = image;
        // }

        const product = await createProduct(req.body, image);

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