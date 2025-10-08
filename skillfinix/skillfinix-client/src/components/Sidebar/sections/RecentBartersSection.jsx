import React from "react";
import { NavLink } from "react-router-dom";
import { Users } from "react-feather";
import { recentBarters } from "../core/NavData";

const RecentBartersSection = () => {
  return (
    <>
      <div className="flex items-center justify-between px-4 py-2">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          Recent SWAPS
        </span>
        <NavLink
          to="/barters"
          className="text-xs text-indigo-600 hover:text-indigo-800"
        >
          View All
        </NavLink>
      </div>
      <div className="px-4 py-1">
        {recentBarters.map((user) => (
          <div
            key={user.id}
            className="flex items-center p-2 mb-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
            onClick={() => console.log(`Navigating to user profile ${user.id}`)}
          >
            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-gray-800 truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.skill}</p>
            </div>
          </div>
        ))}
        <button className="flex items-center w-full py-2 px-3 text-xs font-medium text-indigo-600 bg-white border border-indigo-300 rounded-lg hover:bg-indigo-50 transition-colors mt-2">
          <Users className="h-3 w-3 mr-2" />
          Find More SkillBarters
        </button>
      </div>
    </>
  );
};

export default RecentBartersSection;