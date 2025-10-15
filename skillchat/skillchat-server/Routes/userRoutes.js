const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchUser.js");
const multer = require("multer");  // ADD THIS LINE
const {
  getPresignedUrl,
  getOnlineStatus,
  uploadProfilePhoto,
} = require("../Controllers/userController.js");
const {
  getNonFriendsList,
  updateprofile,
} = require("../Controllers/auth_controller.js");

// Configure multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/online-status/:id", fetchuser, getOnlineStatus);
router.get("/non-friends", fetchuser, getNonFriendsList);
router.put("/update", fetchuser, updateprofile);
router.get("/presigned-url", fetchuser, getPresignedUrl);
router.post("/upload-profile-photo", fetchuser, upload.single("file"), uploadProfilePhoto);

module.exports = router;
