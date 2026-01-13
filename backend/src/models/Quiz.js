const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    // ✅ FIX 1: This array should ONLY store the list of questions for this quiz instance.
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true,
      },
    ],

    // ✅ FIX 2: A new, separate array to store user's answers. NOT required at creation.
    answers: [
      {
        question: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
          required: true,
        },
        selectedAnswerId: {
          // Renamed for clarity, stores the ObjectId of the chosen option
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        isCorrect: {
          type: Boolean,
          required: true,
        },
        timeSpent: {
          type: Number, // in seconds
          default: 0,
        },
        points: {
          type: Number,
          default: 0,
        },
      },
    ],

    settings: {
      timeLimit: {
        type: Number, // seconds per question
        default: 30,
      },
      difficulty: {
        type: String,
        enum: ["easy", "medium", "hard", "mixed"],
        default: "mixed",
      },
      questionCount: {
        type: Number,
        default: 10,
        min: [5, "A quiz must have at least 5 questions"],
      },
    },

    // ✅ FIX 3: The 'results' object is NOT required when starting a quiz.
    results: {
      totalQuestions: { type: Number },
      correctAnswers: { type: Number },
      totalScore: { type: Number },
      percentage: { type: Number },
      totalTime: { type: Number }, // total time in seconds
      averageTimePerQuestion: { type: Number },
    },

    status: {
      type: String,
      enum: ["in-progress", "completed", "abandoned"],
      default: "in-progress",
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for quiz duration (no change needed)
quizSchema.virtual("duration").get(function () {
  if (this.completedAt && this.startedAt) {
    return Math.round((this.completedAt - this.startedAt) / 1000); // in seconds
  }
  return 0;
});

// Virtual for grade (no change needed)
quizSchema.virtual("grade").get(function () {
  const percentage = this.results?.percentage || 0;
  if (percentage >= 90) return "A";
  if (percentage >= 80) return "B";
  if (percentage >= 70) return "C";
  if (percentage >= 60) return "D";
  return "F";
});

// ✅ FIX 4: Refined pre-save hook to use the 'answers' array
quizSchema.pre("save", function (next) {
  // This hook now correctly runs ONLY when you update the status to 'completed'
  if (
    this.isModified("status") &&
    this.status === "completed" &&
    this.answers.length > 0
  ) {
    const totalQuestions = this.questions.length;
    const correctAnswers = this.answers.filter((a) => a.isCorrect).length;
    const totalScore = this.answers.reduce((sum, a) => sum + a.points, 0);
    const totalTime = this.answers.reduce((sum, a) => sum + a.timeSpent, 0);

    this.results = {
      totalQuestions,
      correctAnswers,
      totalScore,
      percentage:
        totalQuestions > 0
          ? Math.round((correctAnswers / totalQuestions) * 100)
          : 0,
      totalTime,
      averageTimePerQuestion:
        totalQuestions > 0 ? Math.round(totalTime / totalQuestions) : 0,
    };

    if (!this.completedAt) {
      this.completedAt = new Date();
    }
  }
  next();
});

// Index for better performance (no changes needed)
quizSchema.index({ user: 1, createdAt: -1 });
quizSchema.index({ category: 1 });
quizSchema.index({ status: 1 });
quizSchema.index({ "results.totalScore": -1 });

// Static methods
quizSchema.statics.getUserHistory = async function (userId, limit, page) {
  return this.find({
    user: userId,
    status: "completed",
  })
    .populate("category", "name color")
    .select("category results completedAt")
    .sort({ completedAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
};

quizSchema.statics.getCategoryLeaderboard = async function (
  categoryId,
  limit = 10
) {
  return this.aggregate([
    {
      $match: {
        category: new mongoose.Types.ObjectId(categoryId),
        status: "completed",
      },
    },
    {
      $group: {
        _id: "$user",
        totalScore: { $sum: "$results.totalScore" },
        quizzesCompleted: { $sum: 1 },
        averageScore: { $avg: "$results.percentage" },
        bestScore: { $max: "$results.percentage" },
      },
    },
    {
      $sort: { totalScore: -1 },
    },
    {
      $limit: limit,
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    {
      $unwind: "$userInfo",
    },
    {
      $project: {
        username: "$userInfo.username",
        firstName: "$userInfo.firstName",
        lastName: "$userInfo.lastName",
        avatar: "$userInfo.avatar",
        totalScore: 1,
        quizzesCompleted: 1,
        averageScore: 1,
        bestScore: 1,
      },
    },
  ]);
};

module.exports = mongoose.model("Quiz", quizSchema);
