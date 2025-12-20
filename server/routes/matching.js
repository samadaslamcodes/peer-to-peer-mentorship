const express = require('express');
const router = express.Router();
const matchingController = require('../controllers/matchingController');

// @route   GET api/matching/find
// @desc    Find mentors
// @access  Public
router.get('/find', matchingController.findMentors);

// @route   GET api/matching/mentors/:id
// @desc    Get a specific mentor by ID
// @access  Public
router.get('/mentors/:id', matchingController.getMentorById);

module.exports = router;
