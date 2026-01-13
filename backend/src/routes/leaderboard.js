const express = require('express');
const {
  getGlobalLeaderboard,
  getCategoryLeaderboard,
  getUserRank
} = require('../controllers/leaderboard');
const { optionalAuth, protect } = require('../middleware/auth');

const router = express.Router();

// Routes
router.get('/global', optionalAuth, getGlobalLeaderboard);
router.get('/category/:categoryId', optionalAuth, getCategoryLeaderboard);
router.get('/rank', protect, getUserRank);

module.exports = router;