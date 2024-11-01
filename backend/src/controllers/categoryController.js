const slugify = require('slugify');
const Category = require('../models/categoryModel');
const { successResponse } = require('../helpers/responseHandler');
const { createCategory, getCategories, singleCategory } = require('../services/categoryService');

const handleCreateCategory = async (req, res, next) => {
    try {
        const { name } = req.body;
        const newCategory = await createCategory(name);

        return successResponse(res, {
            statusCode: 200,
            message: 'Category created successfully!',
            payload: { newCategory }
        });
    } catch (error) {   
        next(error);
    }
}

const handleGetCategory = async (req, res, next) => {
    try {
        const categories = await getCategories();

        return successResponse(res, {
            statusCode: 200,
            message: 'Category fetched successfully!',
            payload:  categories 
        });
    } catch (error) {   
        next(error);
    }
}

const handleSingleCategory = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const category = await singleCategory(slug);

        return successResponse(res, {
            statusCode: 200,
            message: 'Category fetched successfully!',
            payload:  category 
        });
    } catch (error) {   
        next(error);
    }
}

module.exports = { handleCreateCategory, handleGetCategory, handleSingleCategory };