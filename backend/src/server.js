const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const connectDB = require("./config/database");
const errorHandler = require("./middleware/errorHandler");

// Routes
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const categoryRoutes = require("./routes/categories");
const questionRoutes = require("./routes/questions");
const quizRoutes = require("./routes/quizzes");
const leaderboardRoutes = require("./routes/leaderboard");
const userRoutes = require("./routes/users");

const app = express();

/* ===============================
   DATABASE CONNECTION
================================ */
connectDB();

/* ===============================
   SECURITY MIDDLEWARE
================================ */
app.use(helmet());

/* ===============================
   RATE LIMITING
================================ */
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    success: false,
    message: "Too many requests, please try again later."
  }
});
app.use("/api/", limiter);

/* ===============================
   CORS CONFIGURATION (FIXED)
================================ */
const allowedOrigins = [
  "http://localhost:5173",
  "https://quiz-spark1-0.vercel.app"
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman / server-side calls
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

/* ===============================
   BODY PARSERS
================================ */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* ===============================
   LOGGING
================================ */
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

/* ===============================
   HEALTH CHECK
================================ */
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "QuizSpark API is running",
    environment: process.env.NODE_ENV || "production",
    timestamp: new Date().toISOString()
  });
});

/* ===============================
   API ROUTES
================================ */
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/users", userRoutes);

/* ===============================
   404 HANDLER
================================ */
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found"
  });
});

/* ===============================
   GLOBAL ERROR HANDLER
================================ */
app.use(errorHandler);

/* ===============================
   SERVER START
================================ */
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 QuizSpark API running on port ${PORT}`);
});

/* ===============================
   PROCESS ERROR HANDLING
================================ */
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err.message);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err.message);
  process.exit(1);
});

module.exports = app;
