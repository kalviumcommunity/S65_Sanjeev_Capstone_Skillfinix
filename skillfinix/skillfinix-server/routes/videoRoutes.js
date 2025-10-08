const express = require('express');
const videoController = require('../controllers/videoController');
const authController = require('../controllers/authController');
const upload = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/', videoController.getAllVideos);
router.get('/skill/:skill', videoController.getVideosBySkill);

// Protected routes
router.use(authController.protect);
router.post(
  '/',
  upload.single('video'), // Make sure this matches the field name in your form
  videoController.uploadVideo
);

module.exports = router;