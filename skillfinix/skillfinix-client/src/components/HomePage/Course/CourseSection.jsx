import React from "react";
import CourseCard from "./CourseCard";

const CourseSection = ({ title, linkText, linkUrl, type, courses = [] }) => {
  // Create placeholder courses if none provided
  const displayCourses = courses.length > 0 ? courses : Array(4).fill({});

  return (
    <section className="mb-6 sm:mb-8">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">
          {title}
        </h2>
        <a
          href={linkUrl}
          className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-800"
        >
          {linkText}
        </a>
      </div>
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {displayCourses.map((course, index) => (
          <CourseCard key={course.id || index} type={type} course={course} />
        ))}
      </div>
    </section>
  );
};

export default CourseSection;