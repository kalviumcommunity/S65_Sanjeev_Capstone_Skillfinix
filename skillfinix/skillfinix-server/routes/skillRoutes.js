const express = require('express');
const skillController = require('../controllers/skillController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', skillController.getAllSkills);
router.get('/search', skillController.searchSkills);

// Protected routes (require authentication)
router.use(authController.protect);

router.post('/', skillController.createSkill);

module.exports = router;