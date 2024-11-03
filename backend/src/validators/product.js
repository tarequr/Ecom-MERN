const { body } = require('express-validator');

const validateProduct = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('The product name field is required.')
        .isLength({ min: 3, max: 150 })
        .withMessage('Product name should be 3-150 characters long.'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('The description field is required.')
        .isLength({ min: 3 })
        .withMessage('Description should be 3 characters long.'),
    body('price')
        .trim()
        .notEmpty()
        .withMessage('The price field is required.')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number.'),
    body('category')
        .trim()
        .notEmpty()
        .withMessage('The category field is required.'),
    body('quantity')
        .trim()
        .notEmpty()
        .withMessage('The quantity field is required.')
        .isInt({ min: 1 })
        .withMessage('Quantity must be a positive integer.'),
];

module.exports = { validateProduct };