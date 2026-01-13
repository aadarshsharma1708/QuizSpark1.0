const User = require("../models/User");
const Quiz = require("../models/Quiz");
const Category = require("../models/Category");

// Helper function to get date filter based on period
const getDateFilter = (period) => {
  const dateFilter = {};
  const now = new Date();

  switch (period) {
    case "day":
      dateFilter.createdAt = {
        $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
      };
      break;
    case "week":
      const startOfWeek = new Date(now);
      startOfWeek.setHours(0, 0, 0, 0);
      startOfWeek.setDate(now.getDate() - now.getDay()); // Start from Sunday
      dateFilter.createdAt = { $gte: startOfWeek };
      break;
    case "month":
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      dateFilter.createdAt = { $gte: startOfMonth };
      break;
    case "all":
    default:
      // No date filter for all-time
      break;
  }

  return dateFilter;
};

// @desc    Get global leaderboard
// @route   GET /api/leaderboard/global
// @access  Public
const getGlobalLeaderboard = async (req, res, next) => {
  try {
    const { limit = 10, page = 1, period = "all" } = req.query;
    const skip = (page - 1) * limit;

    // Get date filter based on period
    const dateFilter = getDateFilter(period);

    // Get top users by total score
    const leaderboard = await User.aggregate([
      {
        $match: {
          isActive: true,
          "stats.totalQuizzes": { $gt: 0 },
          ...dateFilter,
        },
      },
      {
        $project: {
          username: 1,
          firstName: 1,
          lastName: 1,
          avatar: 1,
          totalScore: "$stats.totalScore",
          totalQuizzes: "$stats.totalQuizzes",
          averageScore: "$stats.averageScore",
          bestScore: "$stats.bestScore",
          currentStreak: "$stats.streak.current",
          longestStreak: "$stats.streak.longest",
        },
      },
      {
        $sort: { totalScore: -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: parseInt(limit),
      },
    ]);

    // Add rank to each user
    const leaderboardWithRank = leaderboard.map((user, index) => ({
      ...user,
      rank: skip + index + 1,
    }));

    // Get total count for pagination
    const total = await User.countDocuments({
      isActive: true,
      "stats.totalQuizzes": { $gt: 0 },
    });

    // Get current user's rank if authenticated
    let currentUserRank = null;
    if (req.user) {
      const userRank = await User.getUserRank(req.user.id);
      currentUserRank = userRank;
    }

    res.status(200).json({
      success: true,
      count: leaderboardWithRank.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
      data: leaderboardWithRank,
      currentUserRank,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get category-specific leaderboard
// @route   GET /api/leaderboard/category/:categoryId
// @access  Public
const getCategoryLeaderboard = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { limit = 10, page = 1, period = "all" } = req.query;

    // Verify category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Get date filter based on period
    const dateFilter = getDateFilter(period);

    // Get leaderboard with time period filter
    const leaderboard = await Quiz.aggregate([
      {
        $match: {
          category: { $eq: categoryId },
          status: "completed",
          ...dateFilter,
        },
      },
      // Convert string categoryId to ObjectId for comparison
      {
        $addFields: {
          category: { $toObjectId: "$category" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $unwind: "$userInfo",
      },
      {
        $group: {
          _id: "$user",
          bestScore: { $max: "$results.totalScore" },
          totalScore: { $sum: "$results.totalScore" },
          totalQuizzes: { $sum: 1 },
          username: { $first: "$userInfo.username" },
          firstName: { $first: "$userInfo.firstName" },
          lastName: { $first: "$userInfo.lastName" },
          avatar: { $first: "$userInfo.avatar" },
        },
      },
      {
        $project: {
          _id: 1,
          bestScore: 1,
          totalScore: 1,
          totalQuizzes: 1,
          username: 1,
          firstName: 1,
          lastName: 1,
          avatar: 1,
          averageScore: {
            $round: [{ $divide: ["$totalScore", "$totalQuizzes"] }, 2],
          },
        },
      },
      {
        $sort: { bestScore: -1 },
      },
      {
        $limit: parseInt(limit),
      },
    ]);

    // Add rank to each user
    const leaderboardWithRank = leaderboard.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));

    // Get current user's rank in this category if authenticated
    let currentUserRank = null;
    if (req.user) {
      const userQuizzes = await Quiz.find({
        user: req.user.id,
        category: categoryId,
        status: "completed",
      });

      if (userQuizzes.length > 0) {
        const userBestScore = Math.max(
          ...userQuizzes.map((q) => q.results.totalScore)
        );
        const betterScores = await Quiz.aggregate([
          {
            $match: {
              category: categoryId,
              status: "completed",
            },
          },
          {
            $group: {
              _id: "$user",
              bestScore: { $max: "$results.totalScore" },
            },
          },
          {
            $match: {
              bestScore: { $gt: userBestScore },
            },
          },
          {
            $count: "count",
          },
        ]);

        currentUserRank =
          betterScores.length > 0 ? betterScores[0].count + 1 : 1;
      }
    }

    res.status(200).json({
      success: true,
      count: leaderboardWithRank.length,
      data: leaderboardWithRank,
      category: {
        id: category._id,
        name: category.name,
        color: category.color,
      },
      currentUserRank,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's rank
// @route   GET /api/leaderboard/rank
// @access  Private
const getUserRank = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get global rank
    const globalRank = await User.getUserRank(userId);

    // Get category ranks
    const userQuizzes = await Quiz.find({
      user: userId,
      status: "completed",
    }).distinct("category");

    const categoryRanks = [];

    for (const categoryId of userQuizzes) {
      const category = await Category.findById(categoryId);
      if (category) {
        const userCategoryQuizzes = await Quiz.find({
          user: userId,
          category: categoryId,
          status: "completed",
        });

        const userBestScore = Math.max(
          ...userCategoryQuizzes.map((q) => q.results.totalScore)
        );

        const betterScores = await Quiz.aggregate([
          {
            $match: {
              category: categoryId,
              status: "completed",
            },
          },
          {
            $group: {
              _id: "$user",
              bestScore: { $max: "$results.totalScore" },
            },
          },
          {
            $match: {
              bestScore: { $gt: userBestScore },
            },
          },
          {
            $count: "count",
          },
        ]);

        const rank = betterScores.length > 0 ? betterScores[0].count + 1 : 1;

        categoryRanks.push({
          category: {
            id: category._id,
            name: category.name,
            color: category.color,
          },
          rank,
          bestScore: userBestScore,
          quizCount: userCategoryQuizzes.length,
        });
      }
    }

    res.status(200).json({
      success: true,
      data: {
        globalRank,
        categoryRanks: categoryRanks.sort((a, b) => a.rank - b.rank),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGlobalLeaderboard,
  getCategoryLeaderboard,
  getUserRank,
};
