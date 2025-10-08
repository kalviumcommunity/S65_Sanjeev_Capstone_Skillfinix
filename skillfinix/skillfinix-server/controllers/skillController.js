const Skill = require('../models/Skill');
const AppError = require('../utils/errorHandler');

exports.getAllSkills = async (req, res, next) => {
  try {
    const skills = await Skill.find().sort({ popularity: -1 });
    
    res.status(200).json({
      status: 'success',
      results: skills.length,
      data: {
        skills
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.createSkill = async (req, res, next) => {
  try {
    const newSkill = await Skill.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: {
        skill: newSkill
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.searchSkills = async (req, res, next) => {
  try {
    const { query } = req.query;
    
    const skills = await Skill.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    }).limit(10);
    
    res.status(200).json({
      status: 'success',
      results: skills.length,
      data: {
        skills
      }
    });
  } catch (err) {
    next(err);
  }
};