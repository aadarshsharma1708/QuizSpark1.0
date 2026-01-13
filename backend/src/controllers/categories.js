const Category = require('../models/Category');
const Question = require('../models/Question');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search, isActive } = req.query;

        // Build query
        const query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        if (isActive !== undefined) {
            query.isActive = isActive === 'true';
        } else {
            // ✅ CHANGE: Default to only showing active categories for public users
            query.isActive = true;
        }

        // Execute query with pagination
        const categories = await Category.find(query)
            .populate('createdBy', 'username firstName lastName')
            .populate('questionCount')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        // Get total count for pagination
        const total = await Category.countDocuments(query);

        res.status(200).json({
            success: true,
            count: categories.length,
            total,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit)
            },
            data: categories
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
const getCategory = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id)
            .populate('createdBy', 'username firstName lastName')
            .populate('questionCount');

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res, next) => {
    try {
        // ✅ CHANGE: Destructure expected fields from the body for security
        const { name, slug, description, icon, color } = req.body;
        const createdBy = req.user.id;

        // ✅ CHANGE: Create the category with isActive explicitly set to true
        const category = await Category.create({
            name,
            slug,
            description,
            icon,
            color,
            createdBy,
            isActive: true // Ensures new categories are visible to users
        });

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: category
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res, next) => {
    try {
        // ✅ CHANGE: Destructure fields to prevent mass assignment vulnerability
        const { name, slug, description, icon, color, isActive } = req.body;

        const updatedData = { name, slug, description, icon, color, isActive };

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            updatedData, // Pass the controlled object, not the entire req.body
            {
                new: true,
                runValidators: true
            }
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            data: category
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Check if category has questions
        const questionCount = await Question.countDocuments({
            category: req.params.id,
            isActive: true
        });

        if (questionCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete category. It has ${questionCount} active questions. Please delete or move the questions first.`
            });
        }

        await category.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get category statistics
// @route   GET /api/categories/:id/stats
// @access  Public
const getCategoryStats = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Get question statistics
        const questionStats = await Question.aggregate([
            {
                $match: {
                    category: category._id,
                    isActive: true
                }
            },
            {
                $group: {
                    _id: '$difficulty',
                    count: { $sum: 1 },
                    avgSuccessRate: { $avg: '$stats.successRate' }
                }
            }
        ]);

        // Get total questions
        const totalQuestions = await Question.countDocuments({
            category: req.params.id,
            isActive: true
        });

        res.status(200).json({
            success: true,
            data: {
                category: {
                    id: category._id,
                    name: category.name,
                    description: category.description
                },
                totalQuestions,
                questionsByDifficulty: questionStats,
                stats: category.stats
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryStats
};