const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    skillBuddy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    skillPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    swap: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exchange",
    },
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      maxlength: 500,
    },
    helpfulness: {
      type: Number,
      default: 0,
    },
    responses: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        comment: { type: String, maxlength: 300 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    visibility: {
      type: String,
      enum: ["public", "private", "connections-only"],
      default: "public",
    },
    reported: {
      isReported: { type: Boolean, default: false },
      reportReason: { type: String },
      reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      reportedAt: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

ratingSchema.index({ skillPartner: 1, skill: 1 });
ratingSchema.index({ skillBuddy: 1 });

ratingSchema.statics.calculateAverageRating = async function (skillPartnerId) {
  const result = await this.aggregate([
    { $match: { skillPartner: mongoose.Types.ObjectId(skillPartnerId) } },
    { $group: { _id: "$skillPartner", averageRating: { $avg: "$rating" } } },
  ]);

  return result.length > 0 ? result[0].averageRating : 0;
};

module.exports = mongoose.model("Rating", ratingSchema);