const Skill = require("../models/Skill");
const User = require("../models/User");

const getAllSkills = async (req, res) => {
  try {
    const { category, search, sortBy } = req.query;

    const query = {};
    if (category) query.category = category;
    if (search) query.$text = { $search: search };

    const sortOptions = {};
    if (sortBy === "popularity") sortOptions.popularity = -1;
    if (sortBy === "newest") sortOptions.createdAt = -1;

    const skills = await Skill.find(query)
      .sort(sortOptions)
      .populate("users.user", "username profile.avatar");

    res.json({
      success: true,
      count: skills.length,
      skills,
    });
  } catch (err) {
    console.error("Error in getAllSkills: ", err.message);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

const getSkillById = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id).populate(
      "users.user",
      "username profile.avatar profile.bio"
    );

    if (!skill) {
      return res.status(404).json({
        success: false,
        msg: "Skill not found",
      });
    }

    res.json({
      success: true,
      skill,
    });
  } catch (err) {
    console.error("Error in getSkillById: ", err.message);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

const createSkill = async (req, res) => {
  try {
    const { name, description, category, difficulty, tags } = req.body;
    
    let skill = await Skill.findOne({ name });
    if (skill) {
      return res.status(400).json({
        success: false,
        msg: "Skill already exists",
      });
    }

    skill = new Skill({
      name,
      description,
      category,
      difficulty,
      tags,
    });

    await skill.save();

    res.status(201).json({
      success: true,
      skill,
    });
  } catch (err) {
    console.error("Error in createSkill: ", err.message);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

const updateSkill = async (req, res) => {
  try {
    const { name, description, category, difficulty, tags } = req.body;

    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      { name, description, category, difficulty, tags },
      { new: true }
    );

    if (!skill) {
      return res.status(404).json({
        success: false,
        msg: "Skill not found",
      });
    }

    res.json({
      success: true,
      skill,
    });
  } catch (err) {
    console.error("Error in updateSkill: ", err.message);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

const getSkillUsers = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id).populate({
      path: "users.user",
      select: "username profile.avatar profile.bio skillsOffering skillsSeeking",
      populate: {
        path: "skillsOffering.skill skillsSeeking.skill",
        select: "name category",
      },
    });

    if (!skill) {
      return res.status(404).json({
        success: false,
        msg: "Skill not found",
      });
    }

    const skillPartners = skill.users.filter(
      (u) => u.role === "skillPartner" || u.role === "both"
    );
    const skillBuddies = skill.users.filter(
      (u) => u.role === "skillBuddy" || u.role === "both"
    );

    res.json({
      success: true,
      skillPartners,
      skillBuddies,
    });
  } catch (err) {
    console.error("Error in getSkillUsers: ", err.message);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

const getSkillCategories = async (req, res) => {
  try {
    const categories = await Skill.distinct("category");
    res.json({
      success: true,
      categories,
    });
  } catch (err) {
    console.error("Error in getSkillCategories: ", err.message);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

module.exports = {
  getAllSkills,
  getSkillById,
  createSkill,
  updateSkill,
  getSkillUsers,
  getSkillCategories,
};