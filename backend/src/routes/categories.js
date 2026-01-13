const express = require('express');
const { body } = require('express-validator');
const {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryStats
} = require('../controllers/categories');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// ✅ --- CHANGE 1: ADDED SLUG VALIDATION ---
// Base validation rules for creating a new category
const createCategoryValidation = [
    body('name')
        .notEmpty()
        .withMessage('Category name is required')
        .isLength({ max: 50 })
        .withMessage('Category name cannot exceed 50 characters')
        .trim(),
    body('slug')
        .notEmpty()
        .withMessage('Slug is required')
        .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .withMessage('Slug must be in a URL-friendly format (e.g., "general-knowledge")')
        .trim(),
    body('description')
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ max: 200 })
        .withMessage('Description cannot exceed 200 characters')
        .trim(),
    body('icon')
        .optional()
        .isLength({ max: 50 })
        .withMessage('Icon name cannot exceed 50 characters'),
    body('color')
        .optional()
        .isHexColor()
        .withMessage('Please provide a valid hex color'),
    body('difficulty')
        .optional()
        .isIn(['easy', 'medium', 'hard', 'mixed'])
        .withMessage('Difficulty must be easy, medium, hard, or mixed'),
    body('tags')
        .optional()
        .isArray()
        .withMessage('Tags must be an array')
];

// ✅ --- CHANGE 2: CREATED A SEPARATE, MORE FLEXIBLE VALIDATION FOR UPDATES ---
// For updates, all fields are optional, allowing partial updates
const updateCategoryValidation = createCategoryValidation.map(rule => rule.optional());

// --- Routes ---

// Public Routes
router.get('/', getCategories);
router.get('/:id', getCategory);
router.get('/:id/stats', getCategoryStats);

// Admin Routes
router.post('/',
    protect,
    authorize('admin'),
    createCategoryValidation, // Use strict validation for creation
    validate,
    createCategory
);

router.put('/:id',
    protect,
    authorize('admin'),
    updateCategoryValidation, // Use flexible validation for updates
    validate,
    updateCategory
);

router.delete('/:id',
    protect,
    authorize('admin'),
    deleteCategory
);

module.exports = router;