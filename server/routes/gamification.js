const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const gamificationController = require('../controllers/gamificationController');

// @route   POST api/gamification/award
// @desc    Award points (Admin or System only - protected)
// @access  Private
router.post('/award', auth, gamificationController.awardPoints);

// @route   GET api/gamification/leaderboard
// @desc    Get leaderboard
// @access  Public
router.get('/leaderboard', gamificationController.getLeaderboard);

module.exports = router;
