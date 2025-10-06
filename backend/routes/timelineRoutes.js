const express = require('express');
const router = express.Router();
const { createTimeline, getMyTimelines, addEventToTimeline, getTimelineById } = require('../controllers/timelineController.js');
const { protect } = require('../middleware/authMiddleware.js'); // Hamara gatekeeper

// Ek nayi timeline banane aur apni saari timelines get karne ke liye route
// Yeh dono actions protected hain, isliye 'protect' middleware ka use kiya hai.
router.route('/').post(protect, createTimeline).get(protect, getMyTimelines);

// Nested route: Ek specific timeline ke andar naya event add karne ke liye
router.route('/:id/events').post(protect, addEventToTimeline);
// Route for getting a single timeline by its ID
router.route('/:id').get(protect, getTimelineById);


module.exports = router;