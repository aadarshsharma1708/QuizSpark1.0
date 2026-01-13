const Question = require('../models/Question');
const Category = require('../models/Category');

const getQuestions = async (req, res, next) => {
    try {
        const { page = 1, limit = 100, category, difficulty, search, isActive } = req.query;
        const query = {};

        if (req.user?.role === 'admin' && isActive !== undefined) {
            query.isActive = isActive === 'true';
        } else {
            query.isActive = true;
        }

        if (category && category !== 'all') {
            query.category = category;
        }

        if (difficulty && difficulty !== 'mixed') {
            query.difficulty = difficulty;
        }

        if (search) {
            query.$or = [
                { question: { $regex: search, $options: 'i' } },
                { explanation: { $regex: search, $options: 'i' } }
            ];
        }

        const questions = await Question.find(query)
            .populate('category', 'name slug color')
            .populate('createdBy', 'username firstName lastName')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Question.countDocuments(query);

        res.status(200).json({
            success: true,
            count: questions.length,
            total,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit)
            },
            data: questions
        });
    } catch (error) {
        next(error);
    }
};

const getQuestion = async (req, res, next) => {
    try {
        const question = await Question.findById(req.params.id)
            .populate('category', 'name slug color')
            .populate('createdBy', 'username firstName lastName');

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        res.status(200).json({
            success: true,
            data: question
        });
    } catch (error) {
        next(error);
    }
};

const createQuestion = async (req, res, next) => {
    try {
        const { question, options, category: categoryId, difficulty, points, explanation } = req.body;
        const createdBy = req.user.id;

        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }
        const newQuestion = await Question.create({
            question,
            options,
            category: categoryId,
            difficulty,
            points,
            explanation,
            createdBy,
            isActive: true
        });

        await Category.findByIdAndUpdate(categoryId, {
            $inc: { 'stats.totalQuestions': 1 }
        });

        res.status(201).json({
            success: true,
            message: 'Question created successfully',
            data: newQuestion
        });
    } catch (error) {
        next(error);
    }
};

const updateQuestion = async (req, res, next) => {
    try {
       
        const { question, options, category, difficulty, points, explanation, isActive } = req.body;

        const updatedData = {
            question,
            options,
            category,
            difficulty,
            points,
            explanation,
            isActive
        };

        const updatedQuestion = await Question.findByIdAndUpdate(
            req.params.id,
            updatedData, 
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedQuestion) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Question updated successfully',
            data: updatedQuestion
        });
    } catch (error) {
        next(error);
    }
};


const deleteQuestion = async (req, res, next) => {
    try {
        const question = await Question.findById(req.params.id);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }
        const categoryId = question.category;

        await question.deleteOne();
        await Category.findByIdAndUpdate(categoryId, {
            $inc: { 'stats.totalQuestions': -1 }
        });

        res.status(200).json({
            success: true,
            message: 'Question deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

const getRandomQuestions = async (req, res, next) => {
    try {
        const { categoryId } = req.params;
        const { count = 10, difficulty = 'mixed' } = req.query;

        const category = await Category.findOne({ _id: categoryId, isActive: true });
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Active category not found'
            });
        }
        
        const questions = await Question.getRandomQuestions(
            categoryId,
            parseInt(count),
            difficulty,
            isActive = true
        );

        if (questions.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No active questions found for this category'
            });
        }

        const quizQuestions = questions.map(question => ({
            _id: question._id,
            question: question.question,
            options: question.options.map(option => ({
                text: option.text,
                _id: option._id
            })),
            difficulty: question.difficulty,
            points: question.points,
            type: question.type
        }));

        res.status(200).json({
            success: true,
            data: quizQuestions,
            category: {
                id: category._id,
                name: category.name,
                slug: category.slug,
                color: category.color
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getQuestions,
    getQuestion,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    getRandomQuestions
};