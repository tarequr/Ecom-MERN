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

    body('password')
        .trim()
        .notEmpty()
        .withMessage('The password field is required.')
        .isLength({ min: 8 })
        .withMessage('The name must be at least 8 characters long.')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        .withMessage('Password should contain at least one uppercase letter, one lowercase letter, one number, and one special character.'),

    body('address')
        .trim()
        .notEmpty()
        .withMessage('The address field is required.')
        .isLength({ min: 3 })
        .withMessage('The name must be at least 3 characters long.'),
    
    body('phone')
        .trim()
        .notEmpty()
        .withMessage('The phone field is required.'),

    body('image')
        .custom((value, { req }) => {
            if (!req.file || !req.file.buffer) {
                throw new Error('The image field is required.');
            }
            return true;
        })
        .withMessage('The image field is required.'),
        // .optional()
        // .isString(),
];

// sign in validation

module.exports = { validateUserRegistration };