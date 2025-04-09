import React from "react";
import { Award } from "react-feather";

const SkillBarterCard = ({ user = {} }) => {
  // Default user data if not provided
  const defaultUser = {
    id: Math.random().toString(36).substr(2, 9),
    name: "Alex Morgan",
    avatar: "/api/placeholder/50/50",
    rating: 4.9,
    skillsToShare: ["JavaScript", "React", "Node.js"],
    skillsToLearn: ["UI Design", "Python"],
  };

  // Merge provided user with defaults
  const userData = { ...defaultUser, ...user };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
      <div className="p-3 sm:p-4 flex flex-col h-full">
        <div className="flex items-center mb-3 sm:mb-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
            <img 
              src={userData.avatar} 
              alt={userData.name} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="ml-2 sm:ml-3 flex-1 min-w-0">
            <h3 className="font-medium text-gray-800 text-sm sm:text-base truncate">
              {userData.name}
            </h3>
            <div className="flex items-center text-amber-500 text-xs sm:text-sm">
              <Award className="h-3 w-3 mr-1 flex-shrink-0" />
              <span>{userData.rating} Rating</span>
            </div>
          </div>
        </div>

        <div className="mb-3 sm:mb-4 flex-1">
          <p className="text-[10px] sm:text-xs font-medium text-gray-500 mb-1.5 sm:mb-2 uppercase">Skills to share</p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {userData.skillsToShare.map((skill, index) => (
              <span 
                key={index} 
                className="text-[10px] sm:text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-md inline-block"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-3 sm:mb-4 flex-1">
          <p className="text-[10px] sm:text-xs font-medium text-gray-500 mb-1.5 sm:mb-2 uppercase">Wants to learn</p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {userData.skillsToLearn.map((skill, index) => (
              <span 
                key={index} 
                className="text-[10px] sm:text-xs px-2 py-1 bg-green-50 text-green-600 rounded-md inline-block"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <button className="w-full py-2 sm:py-2.5 mt-auto text-xs sm:text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
          Connect
        </button>
      </div>
    </div>
  );
};

export default SkillBarterCard;