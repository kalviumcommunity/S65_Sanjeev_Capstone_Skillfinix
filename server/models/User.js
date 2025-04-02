const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+\@.+\..+/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    profile: {
      bio: { type: String, maxlength: 500 },
      avatar: { type: String, default: "default-avatar.png" },
      location: { type: String },
    },
    skillsOffering: [{
      skill: { type: mongoose.Schema.Types.ObjectId, ref: "Skill" },
      proficiency: {
        type: String,
        enum: ["beginner", "intermediate", "advanced", "expert"],
        default: "intermediate"
      },
      resources: [{
        title: String,
        url: String,
        type: {
          type: String,
          enum: ["video", "article", "course", "book"],
          default: "video"
        }
      }]
    }],
    skillsLearning: [{
      skill: { type: mongoose.Schema.Types.ObjectId, ref: "Skill" },
      desiredProficiency: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
        default: "intermediate"
      }
    }],
    exchanges: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exchange"
    }],
    feedback: [{
      fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      skill: { type: mongoose.Schema.Types.ObjectId, ref: "Skill" },
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String, maxlength: 300 }
    }],
    averageRating: { type: Number, min: 0, max: 5, default: 0 },
    lastActive: { type: Date }
  },
  { timestamps: true }
);

userSchema.methods.updateRating = function() {
  const sum = this.feedback.reduce((acc, item) => acc + item.rating, 0);
  this.averageRating = this.feedback.length > 0 ? sum / this.feedback.length : 0;
};

module.exports = mongoose.model("User", userSchema);