const slugify = require('slugify');
const Category = require('../models/categoryModel');
const { successResponse } = require('../helpers/responseHandler');

const handleCreateCategory = async (req, res, next) => {
    try {
        const { name } = req.body;
        
        const newCategory = await Category.create({ name: name, slug: slugify(name) });

        return successResponse(res, {
            statusCode: 200,
            message: 'Category created successfully!',
            payload: { newCategory }
        });
    } catch (error) {   
        next(error);
    }
}


module.exports = { handleCreateCategory };