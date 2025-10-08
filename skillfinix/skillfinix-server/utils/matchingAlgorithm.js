const User = require('../models/User');

const findMatches = async (currentUser) => {
  // Find users who have skills I want to learn and want to learn skills I have
  const potentialMatches = await User.find({
    $and: [
      { _id: { $ne: currentUser._id } }, // Not myself
      { skillsToTeach: { $in: currentUser.skillsToLearn } }, // They teach what I want to learn
      { skillsToLearn: { $in: currentUser.skillsToTeach } } // They want to learn what I teach
    ]
  }).limit(20);

  // Calculate match score based on common skills
  const matchesWithScore = potentialMatches.map(user => {
    const commonTeachSkills = user.skillsToTeach.filter(skill => 
      currentUser.skillsToLearn.includes(skill)
    ).length;
    
    const commonLearnSkills = user.skillsToLearn.filter(skill => 
      currentUser.skillsToTeach.includes(skill)
    ).length;
    
    const score = commonTeachSkills * 2 + commonLearnSkills;
    
    return {
      user,
      score
    };
  });

  // Sort by match score
  return matchesWithScore
    .sort((a, b) => b.score - a.score)
    .map(match => match.user);
};

module.exports = { findMatches };