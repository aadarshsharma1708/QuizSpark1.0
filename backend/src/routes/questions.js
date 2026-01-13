const express = require('express');
const { body } = require('express-validator');
const {
  getQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getRandomQuestions
} = require('../controllers/questions');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// Validation rules
const questionValidation = [
  body('question')
    .isLength({ min: 1, max: 500 })
    .withMessage('Question text is required and cannot exceed 500 characters')
    .trim(),
  body('options')
    .isArray({ min: 2 })
    .withMessage('At least 2 options are required'),
  body('options.*.text')
    .isLength({ min: 1, max: 200 })
    .withMessage('Option text is required and cannot exceed 200 characters')
    .trim(),
  body('options.*.isCorrect')
    .isBoolean()
    .withMessage('isCorrect must be a boolean'),
  body('category')
    .isMongoId()
    .withMessage('Valid category ID is required'),
  body('difficulty')
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Difficulty must be easy, medium, or hard'),
  body('type')
    .optional()
    .isIn(['multiple-choice', 'true-false', 'fill-blank'])
    .withMessage('Type must be multiple-choice, true-false, or fill-blank'),
  body('explanation')
    .optional()
    .isLength({ max: 300 })
    .withMessage('Explanation cannot exceed 300 characters')
    .trim(),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
];

// Routes
router.get('/', getQuestions);
router.get('/random/:categoryId', getRandomQuestions);
router.get('/:id', getQuestion);
router.post('/', protect, authorize('admin'), questionValidation, validate, createQuestion);
router.put('/:id', protect, authorize('admin'), questionValidation, validate, updateQuestion);
router.delete('/:id', protect, authorize('admin'), deleteQuestion);

module.exports = router;