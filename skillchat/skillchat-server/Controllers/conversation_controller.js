const Conversation = require("../Models/Conversation.js");

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

const getConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id).populate(
      "members",
      "-password",
      "-phoneNum"
    );

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

const getConversationList = async (req, res) => {
  const userId = req.user.id;

  try {
    const conversationList = await Conversation.find({
      members: { $in: userId },
    }).populate("members", "-password");

    if (!conversationList) {
      return res.status(404).json({
        error: "No conversation found",
      });
    }

    // remove user from members and also other chatbots
    for (let i = 0; i < conversationList.length; i++) {
      conversationList[i].members = conversationList[i].members.filter(
        (member) => member.id !== userId
      );
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


const createGroupConversation = async (req, res) => {
  try {
    console.log("Group creation payload:", req.body);
    
    const { members: memberIds, isGroup, groupName } = req.body;

    if (!memberIds || !groupName) {
      return res.status(400).json({
        error: "Please provide all required fields: members and groupName",
      });
    }

    // Ensure the current user is part of the group
    if (!memberIds.includes(req.user.id)) {
      memberIds.push(req.user.id);
    }

    // Create a new group conversation with consistent field naming
    const newGroupConversation = await Conversation.create({
      members: memberIds,
      isGroup: true,
      groupName: groupName,
      unreadCounts: memberIds.map((memberId) => ({
        userId: memberId,
        count: 0,
      })),
      latestmessage: "Group created", // Initialize with a message
    });

    // Populate the members data
    await newGroupConversation.populate("members", "-password");

    // Ensure the response has all necessary fields for frontend
    const responseData = newGroupConversation.toObject();

    // Ensure members is an array
    if (!Array.isArray(responseData.members)) {
      responseData.members = [];
    }

    // Return the new group conversation
    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Group creation error:", error);
    return res.status(500).json({ error: "Internal Server Error: " + error.message });
  }
};


module.exports = {
  createConversation,
  getConversation,
  getConversationList,
  createGroupConversation
};


