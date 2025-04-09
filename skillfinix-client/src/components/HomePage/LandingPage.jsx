import React from "react";
import Header from "./Header/Header";
import WelcomeSection from "./WelcomeSection";
import CourseSection from "./Course/CourseSection";
import SkillBartersSection from "../SkillBarters/SkillBartersSection";

const LandingPage = ({ darkMode = false, sidebarCollapsed = true }) => {
  // Sample data for continue learning courses
  const continueLearningCourses = [
    {
      id: "course1",
      title: "JavaScript Fundamentals: From Zero to Hero",
      instructor: "Abhinav Rahul",
      image: "/api/placeholder/320/180",
      progress: 65,
      timeLeft: "25m",
    },
    {
      id: "course2",
      title: "React Hooks Deep Dive",
      instructor: "Akshit Sharma",
      image: "/api/placeholder/320/180",
      progress: 42,
      timeLeft: "18m",
    },
    {
      id: "course3",
      title: "CSS Grid & Flexbox Mastery",
      instructor: "Palli Purushottam Naidu",
      image: "/api/placeholder/320/180",
      progress: 78,
      timeLeft: "10m",
    },
    {
      id: "course4",
      title: "Node.js Backend Development",
      instructor: "Nikhil Pagadala",
      image: "/api/placeholder/320/180",
      progress: 31,
      timeLeft: "45m",
    },
  ];

  // Sample data for recommended courses
  const recommendedCourses = [
    {
      id: "rec1",
      title: "UI Design Principles for Developers",
      instructor: "Akshit Sharma",
      image: "/api/placeholder/320/180",
      rating: 4.8,
      reviews: 342,
    },
    {
      id: "rec2",
      title: "Advanced CSS Layouts and Animations",
      instructor: "Sanjeev",
      image: "/api/placeholder/320/180",
      rating: 4.9,
      reviews: 186,
    },
    {
      id: "rec3",
      title: "TypeScript for React Developers",
      instructor: "Abhinav Rahul",
      image: "/api/placeholder/320/180",
      rating: 4.7,
      reviews: 278,
    },
    {
      id: "rec4",
      title: "Machine Learning Fundamentals",
      instructor: "Palli Purushottam Naidu",
      image: "/api/placeholder/320/180",
      rating: 4.6,
      reviews: 215,
    },
  ];

  // Sample data for skill barter users
  const skillBarterUsers = [
    {
      id: "user1",
      name: "Abhinav Rahul",
      avatar: "/api/placeholder/50/50",
      rating: 4.9,
      skillsToShare: ["JavaScript", "React", "Node.js"],
      skillsToLearn: ["UI Design", "Python"],
    },
    {
      id: "user2",
      name: "Akshit Sharma",
      avatar: "/api/placeholder/50/50",
      rating: 4.7,
      skillsToShare: ["UI Design", "Figma", "CSS"],
      skillsToLearn: ["React", "TypeScript"],
    },
    {
      id: "user3",
      name: "Palli Purushottam Naidu",
      avatar: "/api/placeholder/50/50",
      rating: 4.8,
      skillsToShare: ["Python", "Data Science", "Machine Learning"],
      skillsToLearn: ["JavaScript", "Web Development"],
    },
  ];

  return (
    <div
      className={`flex flex-col h-full w-full transition-all duration-300 ${
        darkMode ? "bg-gray-900/5" : ""
      }`}
    >
      {/* Fixed Header - remains at the top */}
      <Header darkMode={darkMode} sidebarCollapsed={sidebarCollapsed} />
      {/* Scrollable Main Content - positioned below the header */}
      // In LandingPage.jsx
      <main className={`flex-1 overflow-y-auto mt-14 sm:mt-16 p-4 sm:p-6 pb-11 w-full transition-all duration-300 ${darkMode ? 'bg-gray-900/5' : ''}`}>
        <div className="w-full mx-auto">
          {/* Welcome Banner Section */}
          <WelcomeSection />

          {/* Continue Learning Section */}
          <CourseSection
            title="Continue Learning"
            linkText="View All"
            linkUrl="/courses"
            type="progress"
            courses={continueLearningCourses}
          />

          {/* Recommended Section */}
          <CourseSection
            title="Recommended for You"
            linkText="Explore More"
            linkUrl="/explore"
            type="rating"
            courses={recommendedCourses}
          />

          {/* Skill Barters Section */}
          <SkillBartersSection users={skillBarterUsers} />
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
