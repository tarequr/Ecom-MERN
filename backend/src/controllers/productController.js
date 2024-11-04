const slugify = require('slugify');
const Category = require('../models/categoryModel');
const { successResponse } = require('../helpers/responseHandler');
const createError = require('http-errors');
const { createProduct, getProducts } = require('../services/productService');
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

const handleGetProduct = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const {products, count } = await getProducts(page, limit);

        return successResponse(res, {
            statusCode: 200,
            message: 'Product fetched successfully!',
            payload:  { count, products} 
        });
    } catch (error) {   
        next(error);
    }
}

module.exports = { handleCreateProduct, handleGetProduct };