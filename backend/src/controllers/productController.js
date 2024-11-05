const slugify = require('slugify');
const Category = require('../models/categoryModel');
const { successResponse } = require('../helpers/responseHandler');
const createError = require('http-errors');
const { createProduct, getProducts, singleProduct, deleteProduct, updateProduct } = require('../services/productService');
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

const handleUpdateProduct = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const updateOptions = { new: true, runValidators: true, Context: 'query' };
        let updates = {};

        const allowedFields = ['name', 'description', 'price', 'quantity', 'sold', 'shipping'];

        for (let key in req.body) {
            if (allowedFields.includes(key)) {
                updates[key] = req.body[key];
            }
        }

        if (updates.name) {
            updates.slug = slugify(updates.name);
        }

        const image = req.file?.path;

        if (image) {
            if (image.size > 1024 * 1024 * 2) {
                throw createError(400, 'File size must be between 2 MB')
            } 

            // updates.image = image.buffer.toString('base64');
            updates.image = image;
            // user.image != 'default.png' && deleteImage(user.image);
        }

        // const category = await updateCategory(name, slug);

        // const updatedUser = await updateProduct(slug, req);
        

        const updateProduct = await Product.findOneAndUpdate({ slug }, updates, updateOptions);

        if (!updateProduct) {
            throw createError(404, 'Product not found!');
        }
        
        return successResponse(res, {
            statusCode: 200,
            message: 'Product updated successfully',
            payload: updateProduct
        });
    } catch (error) {   
        next(error);
    }
}

/**
 * @description Deletes a product by its slug
 * @route DELETE /api/products/:slug
 * @param {string} slug - The slug of the product to be deleted
 * @returns {object} - A success response with a message of 'Product deleted successfully!'
 */
const handleDeleteProduct = async (req, res, next) => {
    try {
        const { slug } = req.params;
        await deleteProduct(slug);

        return successResponse(res, {
            statusCode: 200,
            message: 'Product deleted successfully!'
        });
    } catch (error) {   
        next(error);
    }
}

module.exports = { handleCreateProduct, handleGetProduct, handleSingleProduct, handleUpdateProduct, handleDeleteProduct };