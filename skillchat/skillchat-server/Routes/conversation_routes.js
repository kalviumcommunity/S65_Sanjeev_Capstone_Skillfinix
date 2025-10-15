const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const {
  createConversation,
  getConversation,
  getConversationList,
  createGroupConversation,
  addMemberToGroup,
  removeMemberFromGroup,
  makeAdmin,
  dismissAdmin,
  updateGroupInfo,
  generateInviteLink,
  revokeInviteLink,
  joinGroupViaLink,
  leaveGroup,
  uploadGroupIcon, // NEW
} = require("../Controllers/conversation_controller.js");
const fetchuser = require("../middleware/fetchUser.js");

// Regular conversations
router.post("/", fetchuser, createConversation);
router.get("/:id", fetchuser, getConversation);
router.get("/", fetchuser, getConversationList);

// Group management
router.post("/group", fetchuser, createGroupConversation);
router.post("/group/add-member", fetchuser, addMemberToGroup);
router.post("/group/remove-member", fetchuser, removeMemberFromGroup);
router.post("/group/make-admin", fetchuser, makeAdmin);
router.post("/group/dismiss-admin", fetchuser, dismissAdmin);
router.put("/group/update-info", fetchuser, updateGroupInfo);

// NEW: Upload group icon
router.post(
  "/group/upload-icon",
  fetchuser,
  upload.single("file"),
  uploadGroupIcon
);

// Invite links
router.post("/group/generate-link", fetchuser, generateInviteLink);
router.post("/group/revoke-link", fetchuser, revokeInviteLink);
router.get("/join/:inviteCode", fetchuser, joinGroupViaLink);

// Leave group
router.post("/group/leave", fetchuser, leaveGroup);

module.exports = router;
