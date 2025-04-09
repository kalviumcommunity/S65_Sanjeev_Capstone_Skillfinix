import React from "react";

const CourseCard = ({ type = "progress", course = {} }) => {
  // Default course data if not provided
  const defaultCourse = {
    id: Math.random().toString(36).substr(2, 9),
    title: type === "progress" 
      ? "JavaScript Fundamentals: From Zero to Hero" 
      : "UI Design Principles for Developers",
    instructor: type === "progress" ? "Alex Morgan" : "Jamie Chen",
    image: `/api/placeholder/320/180`,
    progress: Math.floor(Math.random() * 80) + 20,
    rating: 4.8,
    reviews: 342,
    timeLeft: `${Math.floor(Math.random() * 30) + 10}m`,
  };

  // Merge provided course with defaults
  const courseData = { ...defaultCourse, ...course };
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="aspect-video bg-gray-200 relative flex-shrink-0">
        <img
          src={courseData.image}
          alt={courseData.title}
          className="w-full h-full object-cover"
        />
        {type === "progress" && (
          <div className="absolute bottom-2 right-2 bg-indigo-900 text-white text-xs px-2 py-1 rounded-md">
            {courseData.timeLeft} left
          </div>
        )}
      </div>
      <div className="p-3 sm:p-4 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="font-medium text-gray-800 mb-1 text-sm sm:text-base line-clamp-2 h-10 sm:h-12">
            {courseData.title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mb-2">{courseData.instructor}</p>
        </div>
        
        {type === "progress" ? (
          <div className="w-full h-1.5 bg-gray-200 rounded-full mt-auto">
            <div
              className="h-1.5 bg-indigo-600 rounded-full"
              style={{
                width: `${courseData.progress}%`,
              }}
            ></div>
          </div>
        ) : (
          <div className="flex items-center text-xs sm:text-sm mt-auto">
            <div className="flex items-center text-amber-400 mr-2">
              ★★★★★
              <span className="ml-1 text-gray-600">{courseData.rating}</span>
            </div>
            <span className="text-gray-500">({courseData.reviews} reviews)</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCard;