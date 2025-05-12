const { body } = require('express-validator');

const pantryItemValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 3, max: 100 }).withMessage('Name must be between 3 and 100 characters long'),
    body('category')
        .trim()
        .notEmpty().withMessage('Category is required')
        .isIn(['dairy', 'grains', 'meat', 'vegetables', 'fruits', 'beverages', 'other'])
        .withMessage('Invalid category'),
    body('expiryDate')
        .trim()
        .notEmpty().withMessage('Expiry date is required')
        .isISO8601().withMessage('Expiry date must be a valid date')
        .custom((date) => {
            if (new Date(date) <= new Date()) {
                throw new Error('Expiry date must be in the future');
            }
            return true;
        }),
    body('quantity')
        .notEmpty().withMessage('Quantity is required')
        .isInt({ min: 1 }).withMessage('Quantity must be a positive integer - at least 1'),
    body('barcode')
        .optional()
        .trim()
        .matches(/^(\d{8}|\d{12,13})$/)
        .withMessage('Invalid barcode format (expected 8, 12, or 13 digits)')
];

module.exports = { pantryItemValidation };