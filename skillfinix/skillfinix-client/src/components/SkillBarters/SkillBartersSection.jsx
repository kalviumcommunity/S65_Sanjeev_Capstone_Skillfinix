import React from "react";
import SkillBarterCard from "./SkillBarterCard";

const SkillBartersSection = ({ users = [] }) => {
  // Create placeholder users if none provided
  const displayUsers = users.length > 0 ? users : [
    {
      id: "1",
      name: "Abhinav Rahul",
      avatar: "/api/placeholder/50/50",
      rating: 4.9,
      skillsToShare: ["JavaScript", "React", "Node.js"],
      skillsToLearn: ["UI Design", "Python"],
    },
    {
      id: "2",
      name: "Palli Purushottam Naidu",
      avatar: "/api/placeholder/50/50",
      rating: 4.8,
      skillsToShare: ["Python", "Data Science", "Machine Learning"],
      skillsToLearn: ["JavaScript", "Web Development"],
    },
    {
      id: "3",
      name: "Akshit Sharma",
      avatar: "/api/placeholder/50/50",
      rating: 4.7,
      skillsToShare: ["UI Design", "UX Research", "Figma"],
      skillsToLearn: ["React Native", "Swift"],
    }
  ];

  return (
    <section className="mb-6 sm:mb-8 lg:mb-10">
      <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-5">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
          Top Skill Barters
        </h2>
        <a
          href="/barters"
          className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-800"
        >
          View All
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
        {displayUsers.map((user, index) => (
          <SkillBarterCard key={user.id || index} user={user} />
        ))}
      </div>
    </section>
  );
};

export default SkillBartersSection;