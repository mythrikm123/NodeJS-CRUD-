import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateTask = [
  body('name')
    .notEmpty()
    .withMessage('Task name is required'),

  body('description')
    .notEmpty()
    .withMessage('Description is required'),

  body('status')
    .isIn(['open', 'inProgress', 'inReview', 'resolved', 'canceled'])
    .withMessage('Invalid status'),

  body('priority')
    .notEmpty()
    .withMessage('Priority is required'),

  body('type')
    .isIn(['bug', 'feature', 'improvement'])
    .withMessage('Invalid type'),

  body('assignee')
    .notEmpty()
    .withMessage('Assignee is required'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'nok',
        message: 'Validation errors',
        errors: errors.array(),
      });
    }
    next();
  },
];
