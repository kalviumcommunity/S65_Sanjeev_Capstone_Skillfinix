const User = require("../models/User");
const Skill = require("../models/Skill");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({
        success: false,
        msg: "User already exists with this email or username",
      });
    }

    user = new User({
      username,
      email,
      password,
      profile: {
        bio: "",
        avatar: "default-avatar.png",
        location: "",
      },
      lastActive: new Date(),
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          success: true,
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
          },
        });
      }
    );
  } catch (err) {
    console.error("Error in registerUser: ", err.message);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        msg: "Invalid credentials",
      });
    }

    user.lastActive = new Date();
    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) throw err;
        res.json({
          success: true,
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
          },
        });
      }
    );
  } catch (err) {
    console.error("Error in loginUser: ", err.message);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("skillsOffering.skill", "name category")
      .populate("skillsSeeking.skill", "name category");

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    console.error("Error in getUserProfile: ", err.message);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const {
      username,
      bio,
      avatar,
      location,
      skillsOffering,
      skillsSeeking,
      preferences,
    } = req.body;

    const profileFields = {};

    if (username) profileFields.username = username;

    profileFields.profile = {};
    if (bio) profileFields.profile.bio = bio;
    if (avatar) profileFields.profile.avatar = avatar;
    if (location) profileFields.profile.location = location;

    if (preferences) profileFields.preferences = preferences;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: profileFields },
      { new: true }
    ).select("-password");

    if (skillsOffering && skillsOffering.length > 0) {
      await Skill.updateMany(
        {
          "users.user": req.user.id,
          "users.role": { $in: ["skillPartner", "both"] },
        },
        { $pull: { users: { user: req.user.id } } }
      );

      for (const skillItem of skillsOffering) {
        const skill = await Skill.findById(skillItem.skill);
        if (skill) {
          const userIndex = skill.users.findIndex(
            (u) => u.user.toString() === req.user.id.toString()
          );

          if (userIndex === -1) {
            skill.users.push({
              user: req.user.id,
              role: "skillPartner",
            });
          } else {
            skill.users[userIndex].role = "skillPartner";
          }

          await skill.save();
        }
      }

      user.skillsOffering = skillsOffering;
    }

    if (skillsSeeking && skillsSeeking.length > 0) {
      await Skill.updateMany(
        {
          "users.user": req.user.id,
          "users.role": { $in: ["skillBuddy", "both"] },
        },
        { $pull: { users: { user: req.user.id } } }
      );

      for (const skillItem of skillsSeeking) {
        const skill = await Skill.findById(skillItem.skill);
        if (skill) {
          const userIndex = skill.users.findIndex(
            (u) => u.user.toString() === req.user.id.toString()
          );

          if (userIndex === -1) {
            skill.users.push({
              user: req.user.id,
              role: "skillBuddy",
            });
          } else {
            skill.users[userIndex].role = "skillBuddy";
          }

          await skill.save();
        }
      }

      user.skillsSeeking = skillsSeeking;
    }

    await user.save();

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    console.error("Error in updateUserProfile: ", err.message);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("skillsOffering.skill", "name category")
      .populate("skillsSeeking.skill", "name category");

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    if (
      user.preferences.privacy === "private" &&
      user._id.toString() !== req.user.id.toString()
    ) {
      return res.status(403).json({
        success: false,
        msg: "This profile is private",
      });
    }

    if (user.preferences.privacy === "connections-only") {
      const isConnected = user.connections.some(
        (conn) =>
          conn.user.toString() === req.user.id && conn.status === "accepted"
      );

      if (!isConnected && user._id.toString() !== req.user.id.toString()) {
        return res.status(403).json({
          success: false,
          msg: "This profile is only visible to connections",
        });
      }
    }

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    console.error("Error in getUserById: ", err.message);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

const sendConnectionRequest = async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({
        success: false,
        msg: "Cannot connect with yourself",
      });
    }

    const currentUser = await User.findById(req.user.id);
    const targetUser = await User.findById(req.params.id);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    const existingConnection = currentUser.connections.find(
      (conn) => conn.user.toString() === req.params.id
    );

    if (existingConnection) {
      return res.status(400).json({
        success: false,
        msg: `Connection request already ${existingConnection.status}`,
      });
    }

    currentUser.connections.push({
      user: req.params.id,
      status: "pending",
      createdAt: new Date(),
    });

    targetUser.connections.push({
      user: req.user.id,
      status: "pending",
      createdAt: new Date(),
    });

    await currentUser.save();
    await targetUser.save();

    res.json({
      success: true,
      msg: "Connection request sent",
    });
  } catch (err) {
    console.error("Error in sendConnectionRequest: ", err.message);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

const respondToConnectionRequest = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        msg: "Invalid status",
      });
    }

    const currentUser = await User.findById(req.user.id);
    const otherUser = await User.findById(req.params.id);

    if (!otherUser) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    const connectionIndex = currentUser.connections.findIndex(
      (conn) =>
        conn.user.toString() === req.params.id && conn.status === "pending"
    );

    if (connectionIndex === -1) {
      return res.status(400).json({
        success: false,
        msg: "No pending connection request found",
      });
    }

    currentUser.connections[connectionIndex].status = status;

    const otherConnectionIndex = otherUser.connections.findIndex(
      (conn) =>
        conn.user.toString() === req.user.id && conn.status === "pending"
    );

    if (otherConnectionIndex !== -1) {
      otherUser.connections[otherConnectionIndex].status = status;
    }

    await currentUser.save();
    await otherUser.save();

    res.json({
      success: true,
      msg: `Connection request ${status}`,
    });
  } catch (err) {
    console.error("Error in respondToConnectionRequest: ", err.message);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

const getConnections = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("connections")
      .populate("connections.user", "username profile.avatar profile.bio");

    const connections = user.connections.filter(
      (conn) => conn.status === "accepted"
    );

    res.json({
      success: true,
      connections,
    });
  } catch (err) {
    console.error("Error in getConnections: ", err.message);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

const getPotentialPartners = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("skillsLearning.skill", "name category");

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found"
      });
    }

    const desiredSkills = user.skillsLearning.map(s => s.skill._id);
    
    const partners = await User.aggregate([
      { $match: { 
        _id: { $ne: mongoose.Types.ObjectId(req.user.id) },
        "skillsOffering.skill": { $in: desiredSkills }
      }},
      { $project: {
        username: 1,
        "profile.avatar": 1,
        "profile.bio": 1,
        matchingSkills: {
          $filter: {
            input: "$skillsOffering",
            as: "skill",
            cond: { $in: ["$$skill.skill", desiredSkills] }
          }
        }
      }},
      { $limit: 20 }
    ]);

    res.json({
      success: true,
      partners
    });
  } catch (err) {
    console.error("Error finding partners:", err.message);
    res.status(500).json({
      success: false,
      msg: "Server error"
    });
  }
};

const addSkillOffering = async (req, res) => {
  try {
    const { skillId, proficiency, resources } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { 
        skillsOffering: { 
          skill: skillId, 
          proficiency,
          resources: resources || []
        } 
      }},
      { new: true }
    );

    res.json({
      success: true,
      user
    });
  } catch (err) {
    console.error("Error adding skill:", err.message);
    res.status(500).json({
      success: false,
      msg: "Server error"
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUserById,
  sendConnectionRequest,
  respondToConnectionRequest,
  getConnections,
  getPotentialPartners,
  addSkillOffering,
};