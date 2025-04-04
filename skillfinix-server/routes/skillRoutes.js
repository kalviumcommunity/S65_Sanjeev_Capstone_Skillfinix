const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');
const auth = require('../middlewares/authMiddleware');

router.get('/', skillController.getAllSkills);
router.get('/categories', skillController.getSkillCategories);
router.get('/:id', skillController.getSkillById);
router.get('/:id/users', skillController.getSkillUsers);

router.post('/', auth, skillController.createSkill);
router.put('/:id', auth, skillController.updateSkill);

module.exports = router;