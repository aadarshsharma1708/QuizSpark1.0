const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  getDashboardStats,
  getRecentActivity,
  getUsers,
  updateUserStatus,
  updateUserRole,
  deleteUser,
} = require("../controllers/admin");

router.use(protect); // Require authentication for all admin routes
router.use(authorize("admin")); // Require admin role for all routes

// Dashboard routes
router.get("/stats", getDashboardStats);
router.get("/activity", getRecentActivity);

// User management routes
router.get("/users", getUsers);
router.patch("/users/:id/status", updateUserStatus);
router.patch("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

module.exports = router;
