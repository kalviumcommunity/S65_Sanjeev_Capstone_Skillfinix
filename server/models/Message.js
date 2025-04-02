const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    attachments: [
      {
        fileName: { type: String },
        fileType: { type: String },
        fileUrl: { type: String },
        fileSize: { type: Number },
      },
    ],
    relatedSwap: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exchange",
    },
    readStatus: {
      isRead: { type: Boolean, default: false },
      readAt: { type: Date },
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read", "failed"],
      default: "sent",
    },
  },
  {
    timestamps: true,
  }
);

messageSchema.index({ sender: 1, recipient: 1, createdAt: -1 });
messageSchema.index({ recipient: 1, readStatus: 1 });

messageSchema.methods.markAsRead = function () {
  this.readStatus.isRead = true;
  this.readStatus.readAt = new Date();
  this.status = "read";
};

module.exports = mongoose.model("Message", messageSchema);