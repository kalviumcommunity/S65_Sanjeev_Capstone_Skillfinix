const express = require('express');
const { protectRoute } = require('../middleware/authmiddleware.js');
const { getRecommendedUsers, getMyFriends, sendFriendRequest,acceptFriendRequest, getFriendRequests, getOutgoingFriendRequests} = require('../controllers/usercontroller.js');
const router = express.Router();


// apply auth middleware to all routes
router.use(protectRoute);

router.get("/",getRecommendedUsers)
router.get("/friends",getMyFriends)
router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);

router.get("/friend-requests", getFriendRequests);
router.get("/outgoing-friend-requests", getOutgoingFriendRequests);


module.exports = router;