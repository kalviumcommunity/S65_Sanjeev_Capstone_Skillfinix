const User = require('../models/User');
const AppError = require('../utils/errorHandler');

exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('reviews.reviewer', 'name avatar');
    
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, avatar, skillsToTeach, skillsToLearn } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, avatar, skillsToTeach, skillsToLearn },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.addReview = async (req, res, next) => {
  try {
    const { userId, rating, comment } = req.body;
    
    if (req.user.id === userId) {
      return next(new AppError('You cannot review yourself', 400));
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          reviews: {
            reviewer: req.user.id,
            rating,
            comment
          }
        }
      },
      { new: true }
    );
    
    // Update average rating
    const avgRating = user.reviews.reduce((acc, review) => acc + review.rating, 0) / user.reviews.length;
    user.rating = avgRating;
    await user.save();
    
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (err) {
    next(err);
  }
};