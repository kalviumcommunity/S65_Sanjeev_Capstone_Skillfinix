const Exchange = require("../models/Exchange");
const User = require("../models/User");
const Skill = require("../models/Skill");

const initiateExchange = async (req, res) => {
  try {
    const { partnerId, offerSkillId, learnSkillId } = req.body;

    const [partner, user] = await Promise.all([
      User.findById(partnerId),
      User.findById(req.user.id),
    ]);

    if (!partner || !user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    const canExchange =
      user.skillsOffering.some((s) => s.skill.equals(offerSkillId)) &&
      partner.skillsOffering.some((s) => s.skill.equals(learnSkillId));

    if (!canExchange) {
      return res.status(400).json({
        success: false,
        msg: "Skills not available for exchange",
      });
    }

    const exchange = new Exchange({
      swapBuddies: [req.user.id, partnerId],
      skills: [
        { skill: offerSkillId, skillPartner: req.user.id },
        { skill: learnSkillId, skillPartner: partnerId },
      ],
      status: "pending",
    });

    await exchange.save();

    await User.updateMany(
      { _id: { $in: [req.user.id, partnerId] } },
      { $push: { exchanges: exchange._id } }
    );

    res.status(201).json({
      success: true,
      exchange,
    });
  } catch (err) {
    console.error("Error initiating exchange:", err.message);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

const acceptExchange = async (req, res) => {
  try {
    const exchange = await Exchange.findById(req.params.id);

    if (!exchange) {
      return res.status(404).json({
        success: false,
        msg: "Exchange not found",
      });
    }

    if (!exchange.swapBuddies.includes(req.user.id)) {
      return res.status(403).json({
        success: false,
        msg: "Not authorized to accept this exchange",
      });
    }

    exchange.status = "active";
    await exchange.save();

    res.json({
      success: true,
      exchange,
    });
  } catch (err) {
    console.error("Error accepting exchange:", err.message);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

const addExchangeResource = async (req, res) => {
  try {
    const { exchangeId, skillId, resourceUrl } = req.body;

    const exchange = await Exchange.findOneAndUpdate(
      {
        _id: exchangeId,
        swapBuddies: req.user.id,
        "skills.skill": skillId,
        "skills.skillPartner": req.user.id,
      },
      { $push: { "skills.$.resources": resourceUrl } },
      { new: true }
    );

    if (!exchange) {
      return res.status(404).json({
        success: false,
        msg: "Exchange not found or unauthorized",
      });
    }

    res.json({
      success: true,
      exchange,
    });
  } catch (err) {
    console.error("Error adding resource:", err.message);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

const getPotentialPartners = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('skillsOffering');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    const potentialPartners = await User.find({
      _id: { $ne: req.user.id },
      skillsOffering: { $in: user.skillsSeeking }
    }).select("name skillsOffering");

    res.json({
      success: true,
      potentialPartners,
    });
  } catch (err) {
    console.error("Error fetching potential partners:", err.message);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

module.exports = {
  initiateExchange,
  acceptExchange,
  addExchangeResource,
  getPotentialPartners,
};