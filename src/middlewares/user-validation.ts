import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { handleValidationErrors } from './errorHandler';

export const validateUser = [
  body('username')
    .isString()
    .notEmpty()
    .withMessage('Username is required'),

  body('password')
    .isString()
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),

  body('name')
    .isString()
    .notEmpty()
    .isLength({ min: 3, max: 30 })
    .withMessage('Name must be a string between 3 and 30 characters'),

  body('email')
    .isEmail()
    .notEmpty()
    .withMessage('Email is required'),

  body('phoneNumber')
    .isString()
    .notEmpty()
    .withMessage('Phone number is required'),

  body('city')
    .isString()
    .notEmpty()
    .withMessage('City is required'),

  body('pincode')
    .isString()
    .notEmpty()
    .withMessage('Pincode is required'),

  handleValidationErrors
];

export const validateUserLogin = [
  body('username')
    .isString()
    .notEmpty()
    .withMessage('Username is required'),

  body('password')
    .isString()
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),

  handleValidationErrors
]
