const { body } = require('express-validator');

const validateCategory = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('The category name field is required.')
        .isLength({ min: 3, max: 31 })
        .withMessage('Category name should be 3 characters long.')
];

module.exports = { validateCategory };