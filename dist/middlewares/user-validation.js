"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserLogin = exports.validateUser = void 0;
const express_validator_1 = require("express-validator");
const errorHandler_1 = require("./errorHandler");
exports.validateUser = [
    (0, express_validator_1.body)('username')
        .isString()
        .notEmpty()
        .withMessage('Username is required'),
    (0, express_validator_1.body)('password')
        .isString()
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),
    (0, express_validator_1.body)('name')
        .isString()
        .notEmpty()
        .isLength({ min: 3, max: 30 })
        .withMessage('Name must be a string between 3 and 30 characters'),
    (0, express_validator_1.body)('email')
        .isEmail()
        .notEmpty()
        .withMessage('Email is required'),
    (0, express_validator_1.body)('phoneNumber')
        .isString()
        .notEmpty()
        .withMessage('Phone number is required'),
    (0, express_validator_1.body)('city')
        .isString()
        .notEmpty()
        .withMessage('City is required'),
    (0, express_validator_1.body)('pincode')
        .isString()
        .notEmpty()
        .withMessage('Pincode is required'),
    errorHandler_1.handleValidationErrors
];
exports.validateUserLogin = [
    (0, express_validator_1.body)('username')
        .isString()
        .notEmpty()
        .withMessage('Username is required'),
    (0, express_validator_1.body)('password')
        .isString()
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),
    errorHandler_1.handleValidationErrors
];
