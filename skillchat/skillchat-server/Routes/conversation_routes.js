const express = require("express");
const router = express.Router();

const {
  createConversation,
  getConversation,
  getConversationList,
  createGroupConversation,
} = require("../Controllers/conversation_controller.js");
const fetchuser = require("../middleware/fetchUser.js");

router.post("/", fetchuser, createConversation);
router.get("/:id", fetchuser, getConversation);
router.get("/", fetchuser, getConversationList);
router.post("/group", fetchuser, createGroupConversation);

module.exports = router;
