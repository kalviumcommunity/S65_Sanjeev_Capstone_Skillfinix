const mongoose = require("mongoose");

const exchangeSchema = new mongoose.Schema({
  swapBuddies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    validate: [arrayLimit, '{PATH} must have exactly 2 swap buddies']
  }],

  skills: [{
    skill: { type: mongoose.Schema.Types.ObjectId, ref: "Skill" },
    skillPartner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    resources: [String]
  }],
  
  status: {
    type: String,
    enum: ["pending", "active", "completed", "cancelled"],
    default: "pending"
  },
  chat: [{
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    message: String,
    attachments: [String],
    timestamp: { type: Date, default: Date.now }
  }],
  schedule: {
    type: String,
    enum: ["flexible", "scheduled"],
    default: "flexible"
  },
  meetingTimes: [{
    date: Date,
    duration: Number,
    accepted: { type: Boolean, default: false }
  }]
}, { timestamps: true });

function arrayLimit(val) {
  return val.length === 2;
}

exchangeSchema.index({ swapBuddies: 1, status: 1 });
exchangeSchema.index({ "skills.skill": 1 });

module.exports = mongoose.model("Exchange", exchangeSchema);