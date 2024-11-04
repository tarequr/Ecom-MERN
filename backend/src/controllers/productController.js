const slugify = require('slugify');
const Category = require('../models/categoryModel');
const { successResponse } = require('../helpers/responseHandler');
const createError = require('http-errors');
const { createProduct, getProducts, singleProduct } = require('../services/productService');
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

/**
 * @description Fetches a paginated list of products.
 * @route GET /api/products
 * @param {object} req - The request object, containing query parameters for pagination.
 * @param {object} res - The response object to send the results.
 * @param {function} next - The next middleware function in the stack.
 * @returns {object} - A success response with product data and pagination details.
 */
const handleGetProduct = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const {products, count } = await getProducts(page, limit);

        return successResponse(res, {
            statusCode: 200,
            message: 'Product fetched successfully!',
            payload:  {  
                pagination: {
                    totalPages: Math.ceil(count / limit),
                    currentPage: page,
                    previousPage: page - 1,
                    nextPage: page + 1,
                    totalNumberOfProducts: count,
                },
                products
            } 
        });
    } catch (error) {   
        next(error);
    }
}

/**
 * @description Get a single product by its slug
 * @route GET /api/products/:slug
 * @param {string} slug - The slug of the product to be fetched
 * @returns {object} - The product object
 */
const handleSingleProduct = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const product = await singleProduct(slug);

        return successResponse(res, {
            statusCode: 200,
            message: 'Product fetched successfully!',
            payload:  product 
        });
    } catch (error) {   
        next(error);
    }
}

module.exports = { handleCreateProduct, handleGetProduct, handleSingleProduct };