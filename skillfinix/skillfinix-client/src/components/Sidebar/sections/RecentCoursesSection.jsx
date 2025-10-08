import React from "react";
import { NavLink } from "react-router-dom";
import { recentCourses } from "../core/NavData";

const RecentCoursesSection = () => {
  return (
    <>
      <div className="flex items-center justify-between px-4 py-2 mt-2">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          Recent Courses
        </span>
        <NavLink
          to="/courses"
          className="text-xs text-indigo-600 hover:text-indigo-800"
        >
          View All
        </NavLink>
      </div>
      <div className="px-4 py-1">
        {recentCourses.map((course) => (
          <div
            key={course.id}
            className="flex items-center p-2 mb-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
            onClick={() => console.log(`Navigating to course ${course.id}`)}
          >
            <div className="w-10 h-10 rounded-md bg-gray-200 overflow-hidden flex-shrink-0">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="ml-3 flex-1 overflow-hidden">
              <p className="text-sm font-medium text-gray-800 truncate">
                {course.title}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {course.instructor}
              </p>
              {/* Progress bar */}
              <div className="w-full h-1 bg-gray-200 rounded-full mt-1">
                <div
                  className="h-1 bg-indigo-600 rounded-full"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default RecentCoursesSection;