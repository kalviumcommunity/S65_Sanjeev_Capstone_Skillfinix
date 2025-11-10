const express = require('express');
const { protectRoute } = require('../middleware/authmiddleware.js');
const { getRecommendedUsers, getMyFriends } = require('../controllers/usercontroller.js');
const router = express.Router();

// apply auth middleware to all routes
router.use(protectRoute);

router.get("/",getRecommendedUsers)
router.get("/friends",getMyFriends)
router.post("/friend-request/:id", sendFriendRequest);

module.exports = router;