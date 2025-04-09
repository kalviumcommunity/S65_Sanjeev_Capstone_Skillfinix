import React from "react";

import {
  Home,
  Compass,
  TrendingUp,
  BookOpen,
  MessageSquare,
  RefreshCw,
  Book,
  Clock,
  Star,
  Award,
  Video,
  User,
  Settings,
  Users,
  List,
  ThumbsUp,
  Bookmark,
  HelpCircle,
  Flag,
  MessageCircle,
} from "react-feather";
  
// Navigation items structure - centralized in one place
export const navItems = {
  primary: [
    { icon: <Home className="h-5 w-5" />, label: "Home", path: "/" },
    {
      icon: <BookOpen className="h-5 w-5" />,
      label: "Skill Haunt",
      path: "/learn",
    },
    {
      icon: <RefreshCw className="h-5 w-5" />,
      label: "Barters",
      path: "/barters",
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      label: "SkillChat",
      path: "/messages",
    },
  ],
  you: [
    {
      icon: <Clock className="h-5 w-5" />,
      label: "History",
      path: "/history",
    },
    {
      icon: <Book className="h-5 w-5" />,
      label: "My Courses",
      path: "/courses",
    },
    {
      icon: <Star className="h-5 w-5" />,
      label: "Favorites",
      path: "/favorites",
    },
    {
      icon: <Award className="h-5 w-5" />,
      label: "Achievements",
      path: "/achievements",
    },
    {
      icon: <List className="h-5 w-5" />,
      label: "Playlists",
      path: "/playlists",
    },
    {
      icon: <Video className="h-5 w-5" />,
      label: "Your Videos",
      path: "/your-videos",
    },
    {
      icon: <Bookmark className="h-5 w-5" />,
      label: "Watch Later",
      path: "/watch-later",
    },
    {
      icon: <ThumbsUp className="h-5 w-5" />,
      label: "Liked Content",
      path: "/liked",
    },
  ],
  discover: [
    {
      icon: <Compass className="h-5 w-5" />,
      label: "Explore",
      path: "/explore",
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      label: "Trending",
      path: "/trending",
    },
    {
      icon: <Video className="h-5 w-5" />,
      label: "Live Sessions",
      path: "/live",
    },
  ],
  admin: [
    {
      icon: <Settings className="h-5 w-5" />,
      label: "Settings",
      path: "/settings",
    },
    {
      icon: <HelpCircle className="h-5 w-5" />,
      label: "Help & Support",
      path: "/help",
    },
    {
      icon: <MessageCircle className="h-5 w-5" />,
      label: "Send Feedback",
      path: "/feedback",
    },
    {
      icon: <Flag className="h-5 w-5" />,
      label: "Report History",
      path: "/report-history",
    },
  ],
};
  
// Footer links for reuse
export const footerLinks = [
  { label: "About", path: "/about" },
  { label: "Press", path: "/press" },
  { label: "Copyright", path: "/copyright" },
  { label: "Contact us", path: "/contact" },
  { label: "Creator", path: "/creator" },
  { label: "Advertise", path: "/advertise" },
  { label: "Developers", path: "/developers" },
  { label: "Terms", path: "/terms" },
  { label: "Privacy", path: "/privacy" },
  { label: "Policy & Safety", path: "/policy" },
  { label: "How Skillfinix works", path: "/how-it-works" },
  { label: "Test new features", path: "/beta" },
];
  
// Helper function for NavLink styling
export const getNavLinkClass = (isActive, collapsed) => {
  const baseClasses = "flex items-center rounded-lg transition-all";
  const activeClasses = "bg-[#E5E5E5] text-indigo-700 font-medium";
  const inactiveClasses = "text-gray-700 hover:bg-[#F2F2F2]";
  
  if (collapsed) {
    return `${baseClasses} ${
      isActive ? activeClasses : inactiveClasses
    } flex-col py-3 px-2 mx-1 min-w-[64px]`;
  } else {
    return `${baseClasses} ${
      isActive ? activeClasses : inactiveClasses
    } py-2 my-1 px-3 mx-2`;
  }
};
  
// Mock data for recent courses
export const recentCourses = [
  {
    id: 1,
    title: "JavaScript Fundamentals",
    progress: 67,
    instructor: "Abhinav Rahul",
    thumbnail: "/api/placeholder/40/40",
  },
  {
    id: 2,
    title: "UI Design Essentials",
    progress: 42,
    instructor: "Akshit Sharma",
    thumbnail: "/api/placeholder/40/40",
  },
];
  
// Mock data for barters
export const recentBarters = [
  {
    id: 1,
    name: "Abhinav Rahul",
    skill: "JavaScript",
    avatar: "/api/placeholder/40/40",
  },
  {
    id: 2,
    name: "Akshit Sharma",
    skill: "UI Design",
    avatar: "/api/placeholder/40/40",
  },
];