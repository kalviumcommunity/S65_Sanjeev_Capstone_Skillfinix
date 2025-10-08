const Message = require("../Models/Message.js");
const Conversation = require("../Models/Conversation.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const imageupload = require("../config/imageupload.js");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const {
  AWS_BUCKET_NAME,
  AWS_SECRET,
  AWS_ACCESS_KEY,
} = require("../secrets.js");

const { S3Client } = require("@aws-sdk/client-s3");
const { createPresignedPost } = require("@aws-sdk/s3-presigned-post");

const configuration = new GoogleGenerativeAI(process.env.GENERATIVE_API_KEY);
const modelId = "gemini-2.0-flash";
const model = configuration.getGenerativeModel({ model: modelId });

const sendMessage = async (req, res) => {
  try {
    const { conversationId, senderId, text, imageUrl } = req.body;

    if (!conversationId || !senderId || (!text && !imageUrl)) {
      return res.status(400).json({
        error: "Please fill all the required fields",
      });
    }

    const conversation = await Conversation.findById(conversationId).populate(
      "members",
      "-password"
    );

    if (!conversation) {
      return res.status(404).json({
        error: "Conversation not found",
      });
    }

    // Check if conversation contains a bot
    const botMember = conversation.members.find(
      (member) =>
        member._id.toString() !== senderId.toString() &&
        member.email &&
        member.email.includes("bot")
    );

    if (botMember) {
      // Handle AI conversation
      const userMessage = await Message.create({
        conversationId,
        senderId,
        text,
        imageUrl,
        seenBy: [{ user: senderId, seenAt: new Date() }],
      });

      // Get AI response
      const aiResponse = await getAiResponse(text, senderId, conversationId);

      if (!aiResponse || aiResponse === -1) {
        return res.status(400).json({
          error: "Failed to generate AI response",
        });
      }

      // Update conversation with latest message
      conversation.latestmessage = text || "[Image]";
      conversation.updatedAt = new Date();
      await conversation.save();

      return res.json({
        userMessage,
        aiResponse,
      });
    } else {
      // Normal conversation
      const newMessage = await Message.create({
        conversationId,
        senderId,
        text,
        imageUrl,
        seenBy: [{ user: senderId, seenAt: new Date() }],
      });

      conversation.latestmessage = text || "[Image]";
      conversation.updatedAt = new Date();
      await conversation.save();

      return res.json(newMessage);
    }
  } catch (error) {
    console.error("Error in sendMessage:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
};

const allMessage = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.id,
      deletedFrom: { $ne: req.user.id },
    });

    // Use Promise.all to handle async operations properly
    await Promise.all(
      messages.map(async (message) => {
        let isUserAddedToSeenBy = false;

        message.seenBy.forEach((element) => {
          if (element.user.toString() === req.user.id.toString()) {
            isUserAddedToSeenBy = true;
          }
        });

        if (!isUserAddedToSeenBy) {
          message.seenBy.push({ user: req.user.id, seenAt: new Date() });
          await message.save();
        }
      })
    );

    res.json(messages);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

const deletemesage = async (req, res) => {
  const msgid = req.body.messageid;
  const userids = req.body.userids;

  try {
    const message = await Message.findById(msgid);

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Use Promise.all to handle async operations properly
    await Promise.all(
      userids.map(async (userid) => {
        if (!message.deletedFrom.includes(userid)) {
          message.deletedFrom.push(userid);
        }
      })
    );

    await message.save();
    res.status(200).send("Message deleted successfully");
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const getPresignedUrl = async (req, res) => {
  const filename = req.query.filename;
  const filetype = req.query.filetype;

  if (!filename || !filetype) {
    return res
      .status(400)
      .json({ error: "Filename and filetype are required" });
  }

  const validFileTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/zip",
  ];

  if (!validFileTypes.includes(filetype)) {
    return res.status(400).json({ error: "Invalid file type" });
  }

  const userId = req.user.id;
  const s3Client = new S3Client({
    credentials: {
      accessKeyId: AWS_ACCESS_KEY,
      secretAccessKey: AWS_SECRET,
    },
    region: "ap-south-1",
  });

  try {
    const { url, fields } = await createPresignedPost(s3Client, {
      Bucket: AWS_BUCKET_NAME,
      Key: `conversa/${userId}/${Math.random()}/${filename}`,
      Conditions: [["content-length-range", 0, 5 * 1024 * 1024]],
      Fields: {
        success_action_status: "201",
      },
      Expires: 15 * 60,
    });

    return res.status(200).json({ url, fields });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// PERFECT AI Response Function - Fixed for Bujji Bot
const getAiResponse = async (prompt, senderId, conversationId) => {
  try {
    console.log("getAiResponse called with:", {
      prompt,
      senderId,
      conversationId,
    });

    if (!prompt || !senderId || !conversationId) {
      console.error("Missing required parameters for getAiResponse");
      return -1;
    }

    const conversation = await Conversation.findById(conversationId).populate(
      "members",
      "-password"
    );

    if (!conversation) {
      console.error("Conversation not found");
      return -1;
    }

    // Find the bot member correctly
    const botMember = conversation.members.find(
      (member) =>
        member._id.toString() !== senderId.toString() &&
        member.email &&
        member.email.includes("bot")
    );

    if (!botMember) {
      console.error("No bot member found in conversation");
      console.log(
        "Available members:",
        conversation.members.map((m) => ({ id: m._id, email: m.email }))
      );
      return -1;
    }

    console.log("Bot member found:", botMember.email);

    // Create simple chat session without history to avoid API issues
    const chat = model.startChat({
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      },
    });

    console.log("Sending prompt to AI:", prompt);
    const result = await model.generateContent([
      "You are Bujji, a helpful and friendly AI assistant. Keep responses concise and helpful.",
      prompt,
    ]);

    const response = result.response;
    const responseText = response.text();

    if (!responseText || responseText.length < 1) {
      console.error("Empty response from AI");
      return -1;
    }

    console.log(
      "AI response generated:",
      responseText.substring(0, 50) + "..."
    );

    // Create the bot's response message
    const botMessage = await Message.create({
      conversationId,
      senderId: botMember._id,
      text: responseText,
      seenBy: [{ user: senderId, seenAt: new Date() }],
    });

    console.log("Bot message created successfully:", botMessage._id);

    // Update conversation
    conversation.latestmessage = responseText;
    conversation.updatedAt = new Date();
    await conversation.save();

    return botMessage;
  } catch (error) {
    console.error("Error in getAiResponse:", error);
    console.error("Error stack:", error.stack);
    return -1;
  }
};

const sendMessageHandler = async (data) => {
  const {
    text,
    imageUrl,
    senderId,
    conversationId,
    receiverId,
    isReceiverInsideChatRoom,
  } = data;

  try {
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    if (!isReceiverInsideChatRoom) {
      const message = await Message.create({
        conversationId,
        senderId,
        text,
        imageUrl,
        seenBy: [], // Empty array for unseen messages
      });

      // update conversation latest message and increment unread count of receiver by 1
      conversation.latestmessage = text || "[Image]";

      conversation.unreadCounts = conversation.unreadCounts.map((unread) => {
        if (unread.userId.toString() === receiverId.toString()) {
          unread.count += 1;
        }
        return unread;
      });

      await conversation.save();
      return message;
    } else {
      // create new message with seenby receiver
      const message = await Message.create({
        conversationId,
        senderId,
        text,
        imageUrl,
        seenBy: [
          {
            user: receiverId,
            seenAt: new Date(),
          },
        ],
      });

      conversation.latestmessage = text || "[Image]";
      await conversation.save();
      return message;
    }
  } catch (error) {
    console.error("Error in sendMessageHandler:", error);
    return null;
  }
};

const deleteMessageHandler = async (data) => {
  const { messageId, deleteFrom } = data;

  try {
    const message = await Message.findById(messageId);

    if (!message) {
      return false;
    }

    // Use Promise.all to handle async operations properly
    await Promise.all(
      deleteFrom.map(async (userId) => {
        if (!message.deletedFrom.includes(userId)) {
          message.deletedFrom.push(userId);
        }
      })
    );

    await message.save();
    return true;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

module.exports = {
  sendMessage,
  allMessage,
  getPresignedUrl,
  getAiResponse,
  deletemesage,
  sendMessageHandler,
  deleteMessageHandler,
};
