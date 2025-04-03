const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, getUserById, getConnections, getPotentialPartners,updateUserProfile } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/signup', registerUser);

router.post('/login', loginUser);

router.get('/profile', authMiddleware,getUserProfile);
router.get('/:id', authMiddleware, getUserById);
router.get('/connections/list', authMiddleware,getConnections);
router.get('/partners/suggestions', authMiddleware, getPotentialPartners);
router.put('/profile/update', authMiddleware, updateUserProfile);
module.exports = router;