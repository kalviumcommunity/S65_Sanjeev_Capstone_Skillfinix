const express = require('express');
const matchController = require('../controllers/matchController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

router.get('/', matchController.getPotentialMatches);
router.post('/', matchController.createMatchRequest);
router.patch('/:id', matchController.respondToMatch);

module.exports = router;