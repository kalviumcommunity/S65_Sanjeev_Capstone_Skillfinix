const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // New: Track group admins
    latestmessage: {
      type: String,
      default: "",
    },
    isGroup: {
      type: Boolean,
      default: false,
    },
    groupName: {
      type: String,
      required: function () {
        return this.isGroup;
      },
      default: "",
    },
    groupIcon: {
      type: String, // New: Store group profile photo URL
      default: "",
    },
    groupDescription: {
      type: String, // New: Group description
      default: "",
    },
    inviteLink: {
      type: String, // New: Unique invite link
      unique: true,
      sparse: true, // Only for groups with invite links
    },
    inviteLinkEnabled: {
      type: Boolean, // New: Control if invite link is active
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId, // New: Track group creator
      ref: "User",
    },
    unreadCounts: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        count: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Conversation = mongoose.model("Conversation", ConversationSchema);
module.exports = Conversation;
