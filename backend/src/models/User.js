const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [30, "Username cannot exceed 30 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    avatar: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    stats: {
      totalQuizzes: { type: Number, default: 0 },
      totalScore: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 },
      bestScore: { type: Number, default: 0 },
      streak: {
        current: { type: Number, default: 0 },
        longest: { type: Number, default: 0 },
      },
    },
    preferences: {
      theme: {
        type: String,
        enum: ["light", "dark", "system"],
        default: "system",
      },
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for full name
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Pre-save middleware to hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error("Password comparison failed");
  }
};

// Instance method to update user stats
userSchema.methods.updateStats = function (quizScore, totalQuestions) {
  this.stats.totalQuizzes += 1;
  this.stats.totalScore += quizScore;
  this.stats.averageScore = Math.round(
    this.stats.totalScore / this.stats.totalQuizzes
  );

  if (quizScore > this.stats.bestScore) {
    this.stats.bestScore = quizScore;
  }

  const scorePercentage = (quizScore / totalQuestions) * 100;
  if (scorePercentage >= 70) {
    this.stats.streak.current += 1;
    if (this.stats.streak.current > this.stats.streak.longest) {
      this.stats.streak.longest = this.stats.streak.current;
    }
  } else {
    this.stats.streak.current = 0;
  }

  return this.save();
};

// Static method to get user's global rank
userSchema.statics.getUserRank = async function (userId) {
  // Get the user's total score
  const user = await this.findById(userId);
  if (!user) return null;

  // Count users with higher scores
  const betterUsers = await this.countDocuments({
    "stats.totalScore": { $gt: user.stats.totalScore },
    "stats.totalQuizzes": { $gt: 0 },
    isActive: true,
  });

  // Rank is position after better users + 1
  return betterUsers + 1;
};

module.exports = mongoose.model("User", userSchema);
