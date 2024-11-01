const slugify = require('slugify');
const Category = require('../models/categoryModel');
const { successResponse } = require('../helpers/responseHandler');
const { createCategory, getCategories } = require('../services/categoryService');

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

module.exports = { handleCreateCategory, handleGetCategory };