const mongoose = require("mongoose");
const Quiz = require("../models/Quiz");
const Question = require("../models/Question");
const Category = require("../models/Category");
const User = require("../models/User");

// @desc    Start a new quiz
// @route   POST /api/quizzes/start
// @access  Private
const startQuiz = async (req, res, next) => {
  try {
    const { categoryId, settings } = req.body;
    const userId = req.user.id; // Assumes protect middleware ran

    // 1. Fetch the random question documents from the database
    const randomQuestions = await Question.getRandomQuestions(
      categoryId,
      settings.questionCount,
      settings.difficulty
    );

    if (!randomQuestions || randomQuestions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No questions found for this category to start a quiz.",
      });
    }

    // 2. Extract only the IDs from the question documents for the Quiz schema
    const questionIds = randomQuestions.map((question) => question._id);

    // 3. Find the category to return name/color
    const category = await Category.findById(categoryId).select("name color");
    if (!category) {
      // Highly unlikely but safeguards against concurrency issues
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    // 4. Create the new quiz document with the array of IDs
    const newQuiz = await Quiz.create({
      user: userId,
      category: categoryId,
      settings: settings,
      questions: questionIds,
    });

    // 5. Send the response back to the frontend
    res.status(201).json({
      success: true,
      message: "Quiz started successfully",
      data: {
        quizId: newQuiz._id,
        questions: randomQuestions.map((question) => ({
          // Return full questions without correct answer
          _id: question._id,
          question: question.question,
          options: question.options.map((option) => ({
            text: option.text,
            _id: option._id,
          })),
          difficulty: question.difficulty,
          points: question.points,
          type: question.type,
        })),
        settings: newQuiz.settings,
        category: {
          id: category._id,
          name: category.name,
          color: category.color,
        },
      },
    });
  } catch (error) {
    console.error("Error in startQuiz controller:", error);
    next(error);
  }
};

// @desc    Submit quiz answers
// @route   POST /api/quizzes/submit
// @access  Private
const submitQuiz = async (req, res, next) => {
  try {
    const { quizId, answers } = req.body;

    // Input validation
    if (!quizId || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "Invalid submission data: quizId and answers array required",
      });
    }

    // Find quiz with questions populated
    const quiz = await Quiz.findById(quizId).populate("questions");

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    // Check authorization
    if (quiz.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to submit this quiz",
      });
    }

    // Check quiz status
    if (quiz.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Quiz already completed",
      });
    }

    // Validate all answers are present
    if (answers.length !== quiz.questions.length) {
      return res.status(400).json({
        success: false,
        message: "All questions must be answered",
      });
    } // --- PROCESSING LOGIC ---
    let correctAnswersCount = 0;
    let totalPointsScored = 0;
    let totalTimeSpent = 0;

    // Map submitted answers onto the Quiz document's answers array
    const processedAnswers = [];

    // Loop through the questions (which are now populated documents) to find correct option
    for (const submittedAnswer of answers) {
      // Handle both selectedAnswer and selectedAnswerId
      const selectedAnswerId =
        submittedAnswer.selectedAnswerId || submittedAnswer.selectedAnswer;

      // Validate required fields
      if (!submittedAnswer.questionId || !selectedAnswerId) {
        return res.status(400).json({
          success: false,
          message: "Each answer must include questionId and selectedAnswer",
        });
      }

      const questionDocument = quiz.questions.find(
        (q) => q._id.toString() === submittedAnswer.questionId
      );

      if (!questionDocument) {
        return res.status(400).json({
          success: false,
          message: `Question with ID ${submittedAnswer.questionId} not found in this quiz`,
        });
      }

      // Find the correct option for comparison
      const correctOption = questionDocument.options.find(
        (opt) => opt.isCorrect
      );
      if (!correctOption) {
        return res.status(500).json({
          success: false,
          message: `Internal error: No correct answer found for question ${submittedAnswer.questionId}`,
        });
      }

      const isCorrect =
        selectedAnswerId.toString() === correctOption._id.toString();
      const pointsAwarded = isCorrect ? questionDocument.points || 0 : 0;
      const timeSpent = submittedAnswer.timeSpent || 0;

      // Prepare the answer object for the Quiz.answers schema
      const answerRecord = {
        question: questionDocument._id, // Question ID
        selectedAnswerId: selectedAnswerId, // Use the normalized selectedAnswerId
        isCorrect: isCorrect,
        timeSpent: timeSpent,
        points: pointsAwarded,
      };

      processedAnswers.push(answerRecord);

      // Accumulate stats
      totalPointsScored += pointsAwarded;
      totalTimeSpent += timeSpent;
      if (isCorrect) correctAnswersCount++;

      // Update question stats (optional, but good practice)
      await Question.findByIdAndUpdate(questionDocument._id, {
        $inc: {
          "stats.timesAnswered": 1,
          "stats.timesCorrect": isCorrect ? 1 : 0,
        },
      });
    }

    // --- FINAL RESULTS CALCULATION AND UPDATE ---

    // Update the quiz document's fields
    quiz.answers = processedAnswers; // Save the processed answers
    quiz.status = "completed";
    quiz.completedAt = new Date();

    // NOTE: The pre('save') hook in Quiz.models.js should calculate the results object

    await quiz.save();

    // Update user stats
    const user = await User.findById(req.user.id);
    await user.updateStats(totalPointsScored, quiz.questions.length);

    // Update category stats
    await Category.findByIdAndUpdate(quiz.category, {
      $inc: { "stats.totalQuizzes": 1 },
    });

    // Return final results
    res.status(200).json({
      success: true,
      message: "Quiz submitted successfully",
      data: {
        quizId: quiz._id,
        results: quiz.results, // Use results object calculated by pre-save hook
        grade: quiz.grade,
        completedAt: quiz.completedAt,
      },
    });
  } catch (error) {
    console.error("Quiz submission error:", error);
    // Pass to central error handler
    next(error);
  }
};

// @desc    Get user quiz history
// @route   GET /api/quizzes/history
// @access  Private
const getQuizHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const quizzes = await Quiz.getUserHistory(
      req.user.id,
      parseInt(limit),
      parseInt(page)
    );
    const total = await Quiz.countDocuments({
      user: req.user.id,
      status: "completed",
    });

    res.status(200).json({
      success: true,
      count: quizzes.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
      data: quizzes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get quiz review
// @route   GET /api/quizzes/:id/review
// @access  Private
const getQuizReview = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate("questions", "question options explanation") // Populate questions array directly
      .populate("answers.question", "question options explanation") // Populate each answer's question reference
      .populate("category", "name color");

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    if (quiz.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this quiz",
      });
    }

    if (quiz.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Quiz not completed yet",
      });
    }

    // Format review data
    const reviewData = {
      quizId: quiz._id,
      category: quiz.category,
      results: quiz.results,
      grade: quiz.grade,
      completedAt: quiz.completedAt,
      questions: quiz.answers.map((answer) => {
        // Get the full question doc from answers.question (now populated)
        const questionDoc = answer.question;

        return {
          questionId: questionDoc._id,
          question: questionDoc.question,
          options: questionDoc.options,
          selectedAnswer: answer.selectedAnswerId,
          correctAnswerId: questionDoc.options.find((opt) => opt.isCorrect)
            ?._id,
          isCorrect: answer.isCorrect,
          points: answer.points,
          timeSpent: answer.timeSpent,
          explanation: questionDoc.explanation,
        };
      }),
    };

    res.status(200).json({
      success: true,
      data: reviewData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user quiz statistics
// @route   GET /api/quizzes/stats
// @access  Private
const getUserStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    let quizStats = [];

    // Get user document with stats
    const user = await User.findById(userId).select("stats");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get overall stats
    const totalQuizzes = await Quiz.countDocuments({
      user: userId,
      status: "completed",
    });

    try {
      const aggregateResult = await Quiz.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(userId),
            status: "completed",
          },
        },
        {
          $group: {
            _id: null,
            totalScore: { $sum: "$results.totalScore" },
            averageScore: { $avg: "$results.totalScore" },
            averagePercentage: { $avg: "$results.percentage" },
            bestScore: { $max: "$results.totalScore" },
            bestPercentage: { $max: "$results.percentage" },
          },
        },
      ]);
      quizStats = aggregateResult;
    } catch (aggregateError) {
      console.error("Aggregation error:", aggregateError);
      quizStats = []; // Set empty array if aggregation fails
    }

    // Get category breakdown
    const categoryStats = await Quiz.aggregate([
      {
        $match: {
          user: userId,
          status: "completed",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      {
        $unwind: "$categoryInfo",
      },
      {
        $group: {
          _id: "$category",
          categoryName: { $first: "$categoryInfo.name" },
          categoryColor: { $first: "$categoryInfo.color" },
          quizCount: { $sum: 1 },
          totalScore: { $sum: "$results.totalScore" },
          averageScore: { $avg: "$results.totalScore" },
          bestScore: { $max: "$results.totalScore" },
        },
      },
      {
        $sort: { quizCount: -1 },
      },
    ]);

    // Get recent performance (last 10 quizzes)
    const recentQuizzes = await Quiz.find({
      user: userId,
      status: "completed",
    })
      .populate("category", "name color")
      .sort({ completedAt: -1 })
      .limit(10)
      .select("results category completedAt");

    const stats = {
      totalScore: quizStats[0]?.totalScore || 0,
      averageScore: quizStats[0]?.averageScore || 0,
      averagePercentage: quizStats[0]?.averagePercentage || 0,
      bestScore: quizStats[0]?.bestScore || 0,
      bestPercentage: quizStats[0]?.bestPercentage || 0,
      totalQuizzes,
      currentStreak: user.stats.streak.current,
      longestStreak: user.stats.streak.longest,
    };

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalQuizzes,
          ...stats,
        },
        categoryBreakdown: categoryStats,
        recentPerformance: recentQuizzes,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  startQuiz,
  submitQuiz,
  getQuizHistory,
  getQuizReview,
  getUserStats,
};
