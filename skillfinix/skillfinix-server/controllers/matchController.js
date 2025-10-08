const Match = require('../models/Match');
const User = require('../models/User');
const AppError = require('../utils/errorHandler');
const { findMatches } = require('../utils/matchingAlgorithm');

exports.getPotentialMatches = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const matches = await findMatches(currentUser);
    
    res.status(200).json({
      status: 'success',
      results: matches.length,
      data: {
        matches
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.createMatchRequest = async (req, res, next) => {
  try {
    const { userId, skillsOffered, skillsRequested } = req.body;
    
    if (req.user.id === userId) {
      return next(new AppError('You cannot match with yourself', 400));
    }
    
    const match = await Match.create({
      user1: req.user.id,
      user2: userId,
      skillsOffered,
      skillsRequested,
      status: 'pending'
    });
    
    res.status(201).json({
      status: 'success',
      data: {
        match
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.respondToMatch = async (req, res, next) => {
  try {
    const { matchId, response } = req.body;
    
    const validResponses = ['accepted', 'rejected'];
    if (!validResponses.includes(response)) {
      return next(new AppError('Invalid response type', 400));
    }
    
    const match = await Match.findByIdAndUpdate(
      matchId,
      { status: response },
      { new: true }
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        match
      }
    });
  } catch (err) {
    next(err);
  }
};