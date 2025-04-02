const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  icon: String,
  popularity: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

skillSchema.index({ name: "text", category: "text" });

module.exports = mongoose.model("Skill", skillSchema);