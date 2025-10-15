const Conversation = require("../Models/Conversation.js");
const crypto = require("crypto");

// Create regular conversation
const createConversation = async (req, res) => {
  try {
    const { members: memberIds } = req.body;
    if (!memberIds) {
      return res.status(400).json({
        error: "Please fill all the fields",
      });
    }

    const conv = await Conversation.findOne({
      members: { $all: memberIds },
    }).populate("members", "-password");

    if (conv) {
      conv.members = conv.members.filter(
        (memberId) => memberId !== req.user.id
      );
      return res.status(200).json(conv);
    }

    const newConversation = await Conversation.create({
      members: memberIds,
      unreadCounts: memberIds.map((memberId) => ({
        userId: memberId,
        count: 0,
      })),
    });

    await newConversation.populate("members", "-password");
    newConversation.members = newConversation.members.filter(
      (member) => member.id !== req.user.id
    );

    return res.status(200).json(newConversation);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

// Get single conversation
const getConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id)
      .populate("members", "-password -phoneNum")
      .populate("admins", "-password");

    if (!conversation) {
      return res.status(404).json({
        error: "No conversation found",
      });
    }

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

// Get conversation list - FIXED: Only filter current user from 1-on-1 chats, NOT groups
const getConversationList = async (req, res) => {
  const userId = req.user.id;
  try {
    const conversationList = await Conversation.find({
      members: { $in: userId },
    })
      .populate("members", "-password")
      .populate("admins", "name profilePic");

    if (!conversationList) {
      return res.status(404).json({
        error: "No conversation found",
      });
    }

    // CRITICAL FIX: Only remove user from members for NON-GROUP chats
    for (let i = 0; i < conversationList.length; i++) {
      // Only filter for 1-on-1 chats, keep all members for groups
      if (!conversationList[i].isGroup) {
        conversationList[i].members = conversationList[i].members.filter(
          (member) => member.id !== userId
        );
      }
      // For groups: keep all members including current user so admin checks work
    }

    conversationList.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    res.status(200).json(conversationList);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

// Create group conversation
const createGroupConversation = async (req, res) => {
  try {
    console.log("Group creation payload:", req.body);
    const { members: memberIds, groupName, groupDescription } = req.body;

    if (!memberIds || !groupName) {
      return res.status(400).json({
        error: "Please provide all required fields: members and groupName",
      });
    }

    // Ensure the current user is part of the group
    if (!memberIds.includes(req.user.id)) {
      memberIds.push(req.user.id);
    }

    // Create a new group conversation - creator is automatically admin
    const newGroupConversation = await Conversation.create({
      members: memberIds,
      admins: [req.user.id], // Creator is the first admin
      createdBy: req.user.id,
      isGroup: true,
      groupName: groupName,
      groupDescription: groupDescription || "",
      unreadCounts: memberIds.map((memberId) => ({
        userId: memberId,
        count: 0,
      })),
      latestmessage: "Group created",
    });

    // Populate the members and admins data
    await newGroupConversation.populate("members", "-password");
    await newGroupConversation.populate("admins", "name profilePic");

    const responseData = newGroupConversation.toObject();

    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Group creation error:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error: " + error.message });
  }
};

// Add member to group (only admins can do this)
const addMemberToGroup = async (req, res) => {
  try {
    const { conversationId, memberIds } = req.body;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation || !conversation.isGroup) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Check if user is admin (with null check)
    if (!conversation.admins || !conversation.admins.includes(req.user.id)) {
      return res.status(403).json({ error: "Only admins can add members" });
    }

    // Add new members
    const newMembers = memberIds.filter(
      (id) => !conversation.members.includes(id)
    );

    conversation.members.push(...newMembers);

    // Add unread counts for new members
    newMembers.forEach((memberId) => {
      conversation.unreadCounts.push({
        userId: memberId,
        count: 0,
      });
    });

    await conversation.save();
    await conversation.populate("members", "-password");
    await conversation.populate("admins", "name profilePic");

    return res.status(200).json(conversation);
  } catch (error) {
    console.error("Add member error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Remove member from group (only admins) - FIXED with null checks
const removeMemberFromGroup = async (req, res) => {
  try {
    const { conversationId, memberId } = req.body;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation || !conversation.isGroup) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Check if user is admin
    if (!conversation.admins || !conversation.admins.includes(req.user.id)) {
      return res.status(403).json({ error: "Only admins can remove members" });
    }

    // Cannot remove the creator (with null check)
    if (conversation.createdBy && conversation.createdBy.toString() === memberId) {
      return res.status(403).json({ error: "Cannot remove group creator" });
    }

    // Remove member
    conversation.members = conversation.members.filter(
      (id) => id.toString() !== memberId
    );

    // Remove from admins if they were admin
    if (conversation.admins && conversation.admins.length > 0) {
      conversation.admins = conversation.admins.filter(
        (id) => id.toString() !== memberId
      );
    }

    // Remove unread count
    conversation.unreadCounts = conversation.unreadCounts.filter(
      (uc) => uc.userId.toString() !== memberId
    );

    await conversation.save();
    await conversation.populate("members", "-password");
    await conversation.populate("admins", "name profilePic");

    return res.status(200).json(conversation);
  } catch (error) {
    console.error("Remove member error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Make member an admin (only admins)
const makeAdmin = async (req, res) => {
  try {
    const { conversationId, memberId } = req.body;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation || !conversation.isGroup) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Check if user is admin
    if (!conversation.admins || !conversation.admins.includes(req.user.id)) {
      return res
        .status(403)
        .json({ error: "Only admins can make others admin" });
    }

    // Check if member exists in group
    if (!conversation.members.includes(memberId)) {
      return res.status(404).json({ error: "Member not in group" });
    }

    // Check if already admin
    if (conversation.admins.includes(memberId)) {
      return res.status(400).json({ error: "Already an admin" });
    }

    conversation.admins.push(memberId);
    await conversation.save();
    await conversation.populate("members", "-password");
    await conversation.populate("admins", "name profilePic");

    return res.status(200).json(conversation);
  } catch (error) {
    console.error("Make admin error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Dismiss admin (only admins, cannot dismiss creator) - FIXED
const dismissAdmin = async (req, res) => {
  try {
    const { conversationId, adminId } = req.body;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation || !conversation.isGroup) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Check if user is admin
    if (!conversation.admins || !conversation.admins.includes(req.user.id)) {
      return res
        .status(403)
        .json({ error: "Only admins can dismiss other admins" });
    }

    // Cannot dismiss the creator (with null check)
    if (conversation.createdBy && conversation.createdBy.toString() === adminId) {
      return res.status(403).json({ error: "Cannot dismiss group creator" });
    }

    // Remove from admins
    conversation.admins = conversation.admins.filter(
      (id) => id.toString() !== adminId
    );

    await conversation.save();
    await conversation.populate("members", "-password");
    await conversation.populate("admins", "name profilePic");

    return res.status(200).json(conversation);
  } catch (error) {
    console.error("Dismiss admin error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update group info (only admins)
const updateGroupInfo = async (req, res) => {
  try {
    const { conversationId, groupName, groupDescription, groupIcon } = req.body;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation || !conversation.isGroup) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Check if user is admin
    if (!conversation.admins || !conversation.admins.includes(req.user.id)) {
      return res
        .status(403)
        .json({ error: "Only admins can update group info" });
    }

    if (groupName) conversation.groupName = groupName;
    if (groupDescription !== undefined)
      conversation.groupDescription = groupDescription;
    if (groupIcon) conversation.groupIcon = groupIcon;

    await conversation.save();
    await conversation.populate("members", "-password");
    await conversation.populate("admins", "name profilePic");

    return res.status(200).json(conversation);
  } catch (error) {
    console.error("Update group info error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Generate invite link (only admins)
const generateInviteLink = async (req, res) => {
  try {
    const { conversationId } = req.body;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation || !conversation.isGroup) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Check if user is admin
    if (!conversation.admins || !conversation.admins.includes(req.user.id)) {
      return res
        .status(403)
        .json({ error: "Only admins can generate invite links" });
    }

    // Generate unique invite link
    const inviteCode = crypto.randomBytes(10).toString("hex");
    conversation.inviteLink = inviteCode;
    conversation.inviteLinkEnabled = true;

    await conversation.save();

    return res.status(200).json({
      inviteLink: `${req.protocol}://${req.get("host")}/join/${inviteCode}`,
      inviteCode: inviteCode,
    });
  } catch (error) {
    console.error("Generate invite link error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Revoke invite link (only admins)
const revokeInviteLink = async (req, res) => {
  try {
    const { conversationId } = req.body;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation || !conversation.isGroup) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Check if user is admin
    if (!conversation.admins || !conversation.admins.includes(req.user.id)) {
      return res
        .status(403)
        .json({ error: "Only admins can revoke invite links" });
    }

    conversation.inviteLinkEnabled = false;
    conversation.inviteLink = "";

    await conversation.save();

    return res.status(200).json({ message: "Invite link revoked" });
  } catch (error) {
    console.error("Revoke invite link error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Join group via invite link
const joinGroupViaLink = async (req, res) => {
  try {
    const { inviteCode } = req.params;

    const conversation = await Conversation.findOne({
      inviteLink: inviteCode,
      inviteLinkEnabled: true,
    })
      .populate("members", "-password")
      .populate("admins", "name profilePic");

    if (!conversation) {
      return res
        .status(404)
        .json({ error: "Invalid or expired invite link" });
    }

    // Check if user is already a member
    if (conversation.members.some((m) => m._id.toString() === req.user.id)) {
      return res.status(400).json({ error: "Already a member of this group" });
    }

    // Add user to group
    conversation.members.push(req.user.id);
    conversation.unreadCounts.push({
      userId: req.user.id,
      count: 0,
    });

    await conversation.save();
    await conversation.populate("members", "-password");

    return res.status(200).json(conversation);
  } catch (error) {
    console.error("Join group error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Leave group - FIXED with comprehensive null checks
const leaveGroup = async (req, res) => {
  try {
    const { conversationId } = req.body;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation || !conversation.isGroup) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Check if createdBy exists (for old groups compatibility)
    const createdById = conversation.createdBy
      ? conversation.createdBy.toString()
      : null;
    const currentUserId = req.user.id;

    // If creator is leaving
    if (createdById && createdById === currentUserId) {
      const otherAdmins = conversation.admins.filter(
        (id) => id.toString() !== currentUserId
      );

      if (otherAdmins.length === 0) {
        // Make the first remaining member an admin
        const otherMembers = conversation.members.filter(
          (id) => id.toString() !== currentUserId
        );

        if (otherMembers.length > 0) {
          conversation.admins = [otherMembers[0]];
          conversation.createdBy = otherMembers[0];
        } else {
          // Last member leaving, delete the group
          await Conversation.findByIdAndDelete(conversationId);
          return res
            .status(200)
            .json({ message: "Group deleted - you were the last member" });
        }
      }
    } else if (!createdById) {
      // For old groups without createdBy, handle gracefully
      const isOnlyAdmin =
        conversation.admins &&
        conversation.admins.length === 1 &&
        conversation.admins[0].toString() === currentUserId;

      if (isOnlyAdmin) {
        const otherMembers = conversation.members.filter(
          (id) => id.toString() !== currentUserId
        );

        if (otherMembers.length > 0) {
          conversation.admins = [otherMembers[0]];
          conversation.createdBy = otherMembers[0];
        } else {
          await Conversation.findByIdAndDelete(conversationId);
          return res
            .status(200)
            .json({ message: "Group deleted - you were the last member" });
        }
      }
    }

    // Remove user from members
    conversation.members = conversation.members.filter(
      (id) => id.toString() !== currentUserId
    );

    // Remove user from admins if they are admin
    if (conversation.admins && conversation.admins.length > 0) {
      conversation.admins = conversation.admins.filter(
        (id) => id.toString() !== currentUserId
      );
    }

    // Remove unread count
    conversation.unreadCounts = conversation.unreadCounts.filter(
      (uc) => uc.userId.toString() !== currentUserId
    );

    await conversation.save();

    return res.status(200).json({ message: "Left group successfully" });
  } catch (error) {
    console.error("Leave group error:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error: " + error.message });
  }
};

// Upload group icon - FIXED
const uploadGroupIcon = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // FIXED: Correct path and no preset
    const imageupload = require("../config/imageupload");
    const imageUrl = await imageupload(req.file, false); // false = no preset

    if (!imageUrl || imageUrl === "") {
      throw new Error("Failed to upload image");
    }

    return res.status(200).json({ imageUrl });
  } catch (error) {
    console.error("Upload group icon error:", error);
    return res.status(500).json({ 
      error: "Internal Server Error",
      details: error.message 
    });
  }
};




// Update module.exports
module.exports = {
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
  uploadGroupIcon, // ADD THIS
};