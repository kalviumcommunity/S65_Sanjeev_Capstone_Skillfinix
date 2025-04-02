const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middlewares/authMiddleware');

router.post('/', auth, messageController.sendMessage);
router.get('/conversation/:userId', auth, messageController.getConversation);
router.get('/unread', auth, messageController.getUnreadMessagesCount);
router.get('/conversations', auth, messageController.getRecentConversations);

module.exports = router;