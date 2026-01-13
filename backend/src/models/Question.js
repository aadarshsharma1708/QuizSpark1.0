const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, 'Question text is required'],
        trim: true,
        maxlength: [500, 'Question cannot exceed 500 characters']
    },
    options: [{
        text: {
            type: String,
            required: [true, 'Option text is required'],
            trim: true,
            maxlength: [200, 'Option text cannot exceed 200 characters']
        },
        isCorrect: {
            type: Boolean,
            default: false
        }
    }],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required']
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium', // Added default for robustness
        required: [true, 'Difficulty level is required']
    },
    type: {
        type: String,
        enum: ['multiple-choice', 'true-false', 'fill-blank'],
        default: 'multiple-choice'
    },
    points: {
        type: Number,
        default: function() {
            switch(this.difficulty) {
                case 'easy': return 1;
                case 'medium': return 2;
                case 'hard': return 3;
                default: return 1;
            }
        }
    },
    explanation: {
        type: String,
        trim: true,
        maxlength: [300, 'Explanation cannot exceed 300 characters']
    },
    tags: [{
        type: String,
        trim: true
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    stats: {
        timesAnswered: {
            type: Number,
            default: 0
        },
        timesCorrect: {
            type: Number,
            default: 0
        },
        averageTime: {
            type: Number,
            default: 0
        }
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for success rate
questionSchema.virtual('successRate').get(function() {
    if (this.stats.timesAnswered === 0) return 0;
    return Math.round((this.stats.timesCorrect / this.stats.timesAnswered) * 100);
});

// Validation: Ensure at least one correct answer
questionSchema.pre('save', function(next) {
    const correctAnswers = this.options.filter(option => option.isCorrect);

    if (correctAnswers.length === 0) {
        return next(new Error('At least one option must be marked as correct'));
    }

    if (this.type === 'true-false' && this.options.length !== 2) {
        return next(new Error('True/False questions must have exactly 2 options'));
    }

    if (this.type === 'multiple-choice' && this.options.length < 2) {
        return next(new Error('Multiple choice questions must have at least 2 options'));
    }

    next();
});

// Index for better performance
questionSchema.index({ category: 1, isActive: 1 });
questionSchema.index({ difficulty: 1 });
questionSchema.index({ createdAt: -1 });
questionSchema.index({ 'stats.successRate': 1 });

// ✅ UPDATED STATIC METHOD to fix the quiz loading issue
questionSchema.statics.getRandomQuestions = function(categoryId, count, difficulty) {
    
    // Ensure categoryId is a proper ObjectId (Fix 1)
    const categoryObjectId = new mongoose.Types.ObjectId(categoryId);
    // Ensure count is a number (Fix 2)
    const size = parseInt(count);

    const matchStage = {
        category: categoryObjectId,
        isActive: true // Critical: Only pull active questions
    };

    if (difficulty && difficulty !== 'mixed') {
        matchStage.difficulty = difficulty;
    }

    return this.aggregate([
        { $match: matchStage }, // Filters by Category ID, isActive, and difficulty
        { $sample: { size: size } }, // Pulls the random sample size
    ]);
};

module.exports = mongoose.model('Question', questionSchema);