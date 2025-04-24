const Rating = require("../models/Rating");
const User = require("../models/User");
const Exchange = require("../models/Exchange");
const Skill = require("../models/Skill");

const createRating = async (req, res) => {
  try {
    const { skillPartner, swap, skill, rating, comment, visibility } = req.body;

    const skillPartnerUser = await User.findById(skillPartner);
    if (!skillPartnerUser) {
      return res.status(404).json({
        success: false,
        msg: "Skill Partner not found",
      });
    }

    if (skill) {
      const skillExists = await Skill.findById(skill);
      if (!skillExists) {
        return res.status(404).json({
          success: false,
          msg: "Skill not found",
        });
      }
    }

    if (swap) {
      const swapExists = await Exchange.findById(swap);
      if (!swapExists) {
        return res.status(404).json({
          success: false,
          msg: "Swap not found",
        });
      }

      if (!swapExists.swapBuddies.includes(req.user.id)) {
        return res.status(403).json({
          success: false,
          msg: "Not authorized to rate this swap",
        });
      }

      if (swapExists.status !== "completed") {
        return res.status(400).json({
          success: false,
          msg: "Can only rate completed swaps",
        });
      }
    }

    if (swap) {
      const existingRating = await Rating.findOne({
        skillBuddy: req.user.id,
        swap,
      });

      if (existingRating) {
        return res.status(400).json({
          success: false,
          msg: "You have already rated this swap",
        });
      }
    }

    const newRating = new Rating({
      skillBuddy: req.user.id,
      skillPartner,
      swap,
      skill,
      rating,
      comment,
      visibility,
    });

    await newRating.save();

    const averageRating = await Rating.calculateAverageRating(skillPartner);
    await User.findByIdAndUpdate(skillPartner, { averageRating });

    res.status(201).json({
      success: true,
      rating: newRating,
    });
  } catch (err) {
    console.error("Error in createRating: ", err.message);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

const getSkillPartnerRatings = async (req, res) => {
  try {
    const { skillPartnerId } = req.params;

    const skillPartner = await User.findById(skillPartnerId);
    if (!skillPartner) {
      return res.status(404).json({
        success: false,
        msg: "Skill Partner not found",
      });
    }

    const ratings = await Rating.find({
      skillPartner: skillPartnerId,
      visibility: "public",
    })
      .populate("skillBuddy", "username profile.avatar")
      .populate("skill", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: ratings.length,
      averageRating: skillPartner.averageRating,
      ratings,
    });
  } catch (err) {
    console.error("Error in getSkillPartnerRatings: ", err.message);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

const markRatingHelpful = async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.id);

    if (!rating) {
      return res.status(404).json({
        success: false,
        msg: "Rating not found",
      });
    }

    if (rating.helpfulnessUsers.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        msg: "You have already marked this rating as helpful",
      });
    }

    rating.helpfulness += 1;
    rating.helpfulnessUsers.push(req.user.id);
    await rating.save();

    res.json({
      success: true,
      helpfulness: rating.helpfulness,
    });
  } catch (err) {
    console.error("Error in markRatingHelpful: ", err.message);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

const addRatingResponse = async (req, res) => {
  try {
    const { comment } = req.body;

    const rating = await Rating.findById(req.params.id);

    if (!rating) {
      return res.status(404).json({
        success: false,
        msg: "Rating not found",
      });
    }

    if (rating.skillPartner.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        msg: "Not authorized to respond to this rating",
      });
    }

    rating.responses.push({
      user: req.user.id,
      comment,
    });

    await rating.save();

    res.json({
      success: true,
      rating,
    });
  } catch (err) {
    console.error("Error in addRatingResponse: ", err.message);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

const reportRating = async (req, res) => {
  try {
    const { reason } = req.body;

    const rating = await Rating.findById(req.params.id);

    if (!rating) {
      return res.status(404).json({
        success: false,
        msg: "Rating not found",
      });
    }

    if (rating.reported.isReported) {
      return res.status(400).json({
        success: false,
        msg: "Rating already reported",
      });
    }

    rating.reported = {
      isReported: true,
      reportReason: reason,
      reportedBy: req.user.id,
      reportedAt: new Date(),
    };

    await rating.save();

    res.json({
      success: true,
      msg: "Rating reported successfully",
    });
  } catch (err) {
    console.error("Error in reportRating: ", err.message);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

module.exports = {
  createRating,
  getSkillPartnerRatings,
  markRatingHelpful,
  addRatingResponse,
  reportRating,
};