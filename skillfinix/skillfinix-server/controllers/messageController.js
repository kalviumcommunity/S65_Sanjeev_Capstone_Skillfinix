const Message = require("../models/Message");
const User = require("../models/User");
const Exchange = require("../models/Exchange");

const sendMessage = async (req, res) => {
  try {
    const { recipient, content, attachments, relatedSwap } = req.body;

    const recipientUser = await User.findById(recipient);
    if (!recipientUser) {
      return res.status(404).json({
        success: false,
        msg: "Recipient not found",
      });
    }

    if (relatedSwap) {
      const swap = await Exchange.findById(relatedSwap);
      if (!swap) {
        return res.status(404).json({
          success: false,
          msg: "Related swap not found",
        });
      }

      if (!swap.swapBuddies.includes(req.user.id)) {
        return res.status(403).json({
          success: false,
          msg: "Not authorized to send messages related to this swap",
        });
      }
    }

    const message = new Message({
      sender: req.user.id,
      recipient,
      content,
      attachments,
      relatedSwap,
      status: "sent",
    });

    await message.save();

    res.status(201).json({
      success: true,
      message,
    });
  } catch (err) {
    console.error("Error in sendMessage: ", err.message);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;

    const otherUser = await User.findById(userId);
    if (!otherUser) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    const messages = await Message.find({
      $or: [
        { sender: req.user.id, recipient: userId },
        { sender: userId, recipient: req.user.id },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", "username profile.avatar")
      .populate("recipient", "username profile.avatar");

    await Message.updateMany(
      {
        sender: userId,
        recipient: req.user.id,
        "readStatus.isRead": false,
      },
      {
        $set: {
          "readStatus.isRead": true,
          "readStatus.readAt": new Date(),
          status: "read",
        },
      }
    );

    res.json({
      success: true,
      messages,
    });
  } catch (err) {
    console.error("Error in getConversation: ", err.message);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

const getUnreadMessagesCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      recipient: req.user.id,
      "readStatus.isRead": false,
    });

    res.json({
      success: true,
      count,
    });
  } catch (err) {
    console.error("Error in getUnreadMessagesCount: ", err.message);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

const getRecentConversations = async (req, res) => {
  try {
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: mongoose.Types.ObjectId(req.user.id) },
            { recipient: mongoose.Types.ObjectId(req.user.id) },
          ],
        },
      },
      {
        $project: {
          otherUser: {
            $cond: [
              { $eq: ["$sender", mongoose.Types.ObjectId(req.user.id)] },
              "$recipient",
              "$sender",
            ],
          },
          lastMessage: "$$ROOT",
        },
      },
      {
        $group: {
          _id: "$otherUser",
          lastMessage: { $last: "$lastMessage" },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {
                      $eq: [
                        "$lastMessage.recipient",
                        mongoose.Types.ObjectId(req.user.id),
                      ],
                    },
                    { $eq: ["$lastMessage.readStatus.isRead", false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: 0,
          user: {
            _id: "$user._id",
            username: "$user.username",
            avatar: "$user.profile.avatar",
          },
          lastMessage: 1,
          unreadCount: 1,
        },
      },
      {
        $sort: { "lastMessage.createdAt": -1 },
      },
    ]);

    res.json({
      success: true,
      conversations,
    });
  } catch (err) {
    console.error("Error in getRecentConversations: ", err.message);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

module.exports = {
  sendMessage,
  getConversation,
  getUnreadMessagesCount,
  getRecentConversations
};