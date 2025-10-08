const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

router.get('/me', userController.getUserProfile);
router.patch('/me', userController.updateProfile);
router.post('/:id/reviews', userController.addReview);

module.exports = router;