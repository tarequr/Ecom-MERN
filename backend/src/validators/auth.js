const { body } = require('express-validator');

// registration validation
const validateUserRegistration = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('The name field is required.')
        .isLength({ min: 3, max: 31 })
        .withMessage('Name should be between 3 and 31 characters.'),
    
    body('email')
        .trim()
        .notEmpty()
        .withMessage('The email field is required.')
        .isEmail()
        .withMessage('Invalid email address.'),
];

// sign in validation

module.exports = { validateUserRegistration };