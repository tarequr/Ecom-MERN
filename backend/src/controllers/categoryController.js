const slugify = require('slugify');
const Category = require('../models/categoryModel');
const { successResponse } = require('../helpers/responseHandler');
const { createCategory, getCategories, singleCategory, updateCategory, deleteCategory } = require('../services/categoryService');
const createError = require('http-errors');

const handleCreateCategory = async (req, res, next) => {
    try {
        const { name } = req.body;
        const newCategory = await createCategory(name);

        return successResponse(res, {
            statusCode: 201,
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

const handleUpdateCategory = async (req, res, next) => {
    try {
        const { name } = req.body;
        const { slug } = req.params;
        const category = await updateCategory(name, slug);

        if (!category) {
            throw createError(404, 'Category not found!');
        }
        return successResponse(res, {
            statusCode: 200,
            message: 'Category updated successfully!',
            payload:  category 
        });
    } catch (error) {   
        next(error);
    }
}

const handleDeleteCategory = async (req, res, next) => {
    try {
        const { slug } = req.params;
        await deleteCategory(slug);

        return successResponse(res, {
            statusCode: 200,
            message: 'Category deleted successfully!'
        });
    } catch (error) {   
        next(error);
    }
}


module.exports = { handleCreateCategory, handleGetCategory, handleSingleCategory, handleUpdateCategory, handleDeleteCategory };