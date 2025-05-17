"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pantryItemUpdateValidation = exports.pantryItemValidation = void 0;
const express_validator_1 = require("express-validator");
exports.pantryItemValidation = [
    (0, express_validator_1.body)('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 3, max: 100 }).withMessage('Name must be between 3 and 100 characters long'),
    (0, express_validator_1.body)('category')
        .trim()
        .notEmpty().withMessage('Category is required')
        .isIn(['dairy', 'grains', 'meat', 'vegetables', 'fruits', 'beverages', 'other'])
        .withMessage('Invalid category'),
    (0, express_validator_1.body)('expiryDate')
        .trim()
        .notEmpty().withMessage('Expiry date is required')
        .isISO8601().withMessage('Expiry date must be a valid date')
        .custom((date) => {
        if (date < new Date().toISOString().split('T')[0]) {
            throw new Error('Expiry date must not be in the past');
        }
        return true;
    }),
    (0, express_validator_1.body)('quantity')
        .notEmpty().withMessage('Quantity is required')
        .isInt({ min: 1 }).withMessage('Quantity must be a positive integer - at least 1'),
    (0, express_validator_1.body)('barcode')
        .optional()
        .trim()
        .matches(/^(\d{8}|\d{12,13})$/)
        .withMessage('Invalid barcode format (expected 8, 12, or 13 digits)')
];
exports.pantryItemUpdateValidation = [
    (0, express_validator_1.body)('name')
        .optional()
        .trim()
        .isLength({ min: 3, max: 100 }).withMessage('Name must be between 3 and 100 characters long'),
    (0, express_validator_1.body)('category')
        .optional()
        .trim()
        .isIn(['dairy', 'grains', 'meat', 'vegetables', 'fruits', 'beverages', 'other'])
        .withMessage('Invalid category'),
    (0, express_validator_1.body)('expiryDate')
        .optional()
        .trim()
        .isISO8601().withMessage('Expiry date must be a valid date')
        .custom((date) => {
        if (date < new Date().toISOString().split('T')[0]) {
            throw new Error('Expiry date must not be in the past');
        }
        return true;
    }),
    (0, express_validator_1.body)('quantity')
        .optional()
        .isInt({ min: 1 }).withMessage('Quantity must be a positive integer - at least 1'),
    (0, express_validator_1.body)('barcode')
        .optional()
        .trim()
        .matches(/^(\d{8}|\d{12,13})$/)
        .withMessage('Invalid barcode format (expected 8, 12, or 13 digits)')
];
