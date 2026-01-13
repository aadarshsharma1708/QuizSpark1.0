const express = require('express');
const { body } = require('express-validator');
const {
  startQuiz,
  submitQuiz,
  getQuizHistory,
  getQuizReview,
  getUserStats
} = require('../controllers/quizzes');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// Validation rules
const startQuizValidation = [
  body('categoryId')
    .isMongoId()
    .withMessage('Valid category ID is required'),
  body('settings.questionCount')
    .optional()
    .isInt({ min: 5, max: 50 })
    .withMessage('Question count must be between 5 and 50'),
  body('settings.timeLimit')
    .optional()
    .isInt({ min: 10, max: 300 })
    .withMessage('Time limit must be between 10 and 300 seconds'),
  body('settings.difficulty')
    .optional()
    .isIn(['easy', 'medium', 'hard', 'mixed'])
    .withMessage('Difficulty must be easy, medium, hard, or mixed')
];

const submitQuizValidation = [
  body('quizId')
    .isMongoId()
    .withMessage('Valid quiz ID is required'),
  body('answers')
    .isArray({ min: 1 })
    .withMessage('Answers array is required'),
  body('answers.*.questionId')
    .isMongoId()
    .withMessage('Valid question ID is required'),
  body('answers.*.selectedAnswer')
    .notEmpty()
    .withMessage('Selected answer is required'),
  body('answers.*.timeSpent')
    .isInt({ min: 0 })
    .withMessage('Time spent must be a positive number')
];

// Routes
router.post('/start', protect, startQuizValidation, validate, startQuiz);
router.post('/submit', protect, submitQuizValidation, validate, submitQuiz);
router.get('/history', protect, getQuizHistory);
router.get('/stats', protect, getUserStats);
router.get('/:id/review', protect, getQuizReview);

module.exports = router;