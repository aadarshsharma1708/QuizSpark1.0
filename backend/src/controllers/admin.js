const User = require("../models/User");
const Quiz = require("../models/Quiz");
const Question = require("../models/Question");
const Category = require("../models/Category");


const getDashboardStats = async (req, res, next) => {
  try {
    // Get total counts
    const totalUsers = await User.countDocuments();
    const totalQuizzes = await Quiz.countDocuments();
    const totalQuestions = await Question.countDocuments();
    const totalCategories = await Category.countDocuments();

    // Get active users (users who took quiz in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activeUsers = await User.countDocuments({
      lastActive: { $gte: thirtyDaysAgo },
    });

    // Get quizzes taken this month
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);
    const quizzesThisMonth = await Quiz.countDocuments({
      startedAt: { $gte: firstDayOfMonth },
    });

    // Calculate average score
    const quizzes = await Quiz.find({ status: "completed" });
    const totalScore = quizzes.reduce(
      (acc, quiz) => acc + (quiz.results?.percentage || 0),
      0
    );
    const averageScore =
      quizzes.length > 0 ? (totalScore / quizzes.length).toFixed(1) : 0;

    // Get most popular category
    const categoryStats = await Quiz.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },
    ]);
    const topCategory = categoryStats[0]?.category[0]?.name || "None";

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalQuizzes,
        totalQuestions,
        totalCategories,
        activeUsers,
        quizzesThisMonth,
        averageScore,
        topCategory,
      },
    });
  } catch (error) {
    next(error);
  }
};


const getRecentActivity = async (req, res, next) => {
  try {
    const limit = 20;

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("username createdAt");

    // Get recent completed quizzes
    const recentQuizzes = await Quiz.find({ status: "completed" })
      .sort({ completedAt: -1 })
      .limit(limit)
      .populate("user", "username")
      .populate("category", "name");

    // Get recent questions
    const recentQuestions = await Question.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("createdBy", "username")
      .populate("category", "name");

    // Get recent categories
    const recentCategories = await Category.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("createdBy", "username");

    // Combine and sort all activities
    const activities = [
      ...recentUsers.map((user) => ({
        id: user._id,
        type: "user_registered",
        user: user.username,
        timestamp: user.createdAt,
        details: "New user registration",
      })),
      ...recentQuizzes.map((quiz) => ({
        id: quiz._id,
        type: "quiz_completed",
        user: quiz.user.username,
        timestamp: quiz.completedAt,
        details: `Completed ${quiz.category.name} Quiz with ${quiz.results.percentage}% score`,
      })),
      ...recentQuestions.map((question) => ({
        id: question._id,
        type: "question_added",
        user: question.createdBy.username,
        timestamp: question.createdAt,
        details: `Added new question to ${question.category.name} category`,
      })),
      ...recentCategories.map((category) => ({
        id: category._id,
        type: "category_created",
        user: category.createdBy.username,
        timestamp: category.createdAt,
        details: `Created new category: ${category.name}`,
      })),
    ];

    // Sort by timestamp and limit to 20 most recent
    const sortedActivities = activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 20);

    res.status(200).json({
      success: true,
      data: sortedActivities,
    });
  } catch (error) {
    next(error);
  }
};


const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const updateUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be a boolean value",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isActive = isActive;
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!["user", "moderator", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent self-demotion
    if (user._id.toString() === req.user._id.toString() && role !== "admin") {
      return res.status(400).json({
        success: false,
        message: "Admin cannot remove their own admin status",
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent self-deletion
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Admin cannot delete themselves",
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getRecentActivity,
  getUsers,
  updateUserStatus,
  updateUserRole,
  deleteUser,
};
