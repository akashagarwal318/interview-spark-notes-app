import { body, validationResult } from 'express-validator';

// Validation rules for creating a question
export const validateQuestion = [
  body('round')
    .custom(value => {
      const predefined = ['technical', 'hr', 'telephonic', 'introduction', 'behavioral', 'system-design', 'coding'];
      if (predefined.includes(value)) return true;
      // allow custom slug: lowercase letters, numbers, hyphens, 2-40 chars
      return /^[a-z0-9-]{2,40}$/.test(value || '');
    })
    .withMessage('Round must be predefined or a custom slug (lowercase letters, numbers, hyphens, 2-40 chars).'),
  
  body('question')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Question must be between 10 and 2000 characters'),
  
  body('answer')
    .trim()
    .isLength({ min: 10, max: 10000 })
    .withMessage('Answer must be between 10 and 10000 characters'),
  
  body('code')
    .optional()
    .isLength({ max: 5000 })
    .withMessage('Code must not exceed 5000 characters'),
  
  body('tags')
    .optional()
    .isArray({ max: 20 })
    .withMessage('Tags must be an array with maximum 20 items'),
  
  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each tag must be between 1 and 50 characters'),
  
  body('difficulty')
    .optional()
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Difficulty must be easy, medium, or hard'),
  
  body('company')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Company name must not exceed 100 characters'),
  
  body('position')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Position must not exceed 100 characters'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes must not exceed 1000 characters'),
  
  body('images')
    .optional()
    .isArray({ max: 10 })
    .withMessage('Images must be an array with maximum 10 items'),
  
  body('images.*.name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Image name must be between 1 and 255 characters'),
  
  body('images.*.data')
    .optional()
    .matches(/^data:image\/[a-zA-Z0-9.+-]+;base64,/)
    .withMessage('Image data must be a valid base64 encoded image (data:image/<type>;base64,...)'),
  
  body('images.*.size')
    .optional()
    .isInt({ min: 1, max: 10485760 }) // 10MB max
    .withMessage('Image size must be between 1 byte and 10MB'),
  
  // Middleware to handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

// Validation rules for updating a question (more lenient)
export const validateQuestionUpdate = [
  body('round')
    .optional()
    .custom(value => {
      const predefined = ['technical', 'hr', 'telephonic', 'introduction', 'behavioral', 'system-design', 'coding'];
      if (predefined.includes(value)) return true;
      return /^[a-z0-9-]{2,40}$/.test(value || '');
    })
    .withMessage('Round must be predefined or a custom slug (lowercase letters, numbers, hyphens, 2-40 chars).'),
  
  body('question')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Question must be between 10 and 2000 characters'),
  
  body('answer')
    .optional()
    .trim()
    .isLength({ min: 10, max: 10000 })
    .withMessage('Answer must be between 10 and 10000 characters'),
  
  body('code')
    .optional()
    .isLength({ max: 5000 })
    .withMessage('Code must not exceed 5000 characters'),
  
  body('tags')
    .optional()
    .isArray({ max: 20 })
    .withMessage('Tags must be an array with maximum 20 items'),
  
  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each tag must be between 1 and 50 characters'),
  
  body('difficulty')
    .optional()
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Difficulty must be easy, medium, or hard'),
  
  body('company')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Company name must not exceed 100 characters'),
  
  body('position')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Position must not exceed 100 characters'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes must not exceed 1000 characters'),
  
  body('favorite')
    .optional()
    .isBoolean()
    .withMessage('Favorite must be a boolean value'),
  
  body('review')
    .optional()
    .isBoolean()
    .withMessage('Review must be a boolean value'),
  
  body('hot')
    .optional()
    .isBoolean()
    .withMessage('Hot must be a boolean value'),
  
  body('images')
    .optional()
    .isArray({ max: 10 })
    .withMessage('Images must be an array with maximum 10 items'),
  
  body('images.*.name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Image name must be between 1 and 255 characters'),
  
  body('images.*.data')
    .optional()
    .matches(/^data:image\/[a-zA-Z0-9.+-]+;base64,/)
    .withMessage('Image data must be a valid base64 encoded image (data:image/<type>;base64,...)'),
  
  body('images.*.size')
    .optional()
    .isInt({ min: 1, max: 10485760 }) // 10MB max
    .withMessage('Image size must be between 1 byte and 10MB'),
  
  // Middleware to handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

// Generic validation error handler
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};
