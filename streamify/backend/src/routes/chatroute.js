const express = require('express');
const router = express.Router();
const { protectRoute } = require('../middleware/authmiddleware.js');
const { getStreamToken } = require('../controllers/chatcontroller.js');

router.get("/token", protectRoute, getStreamToken)
module.exports = router;