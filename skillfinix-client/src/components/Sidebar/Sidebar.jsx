import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
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
  Mic,
  Plus,
  Menu,
  PlayCircle,
  Heart,
  List,
  ThumbsUp,
  Bookmark,
  Edit,
  HelpCircle,
  Flag,
  MessageCircle,
  ChevronRight,
} from "react-feather";

const Sidebar = ({ onToggle }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Track window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Navigation items structure
  const navItems = {
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
        icon: <PlayCircle className="h-5 w-5" />,
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

  // Helper function for NavLink className
  const getNavLinkClass = ({ isActive }) => {
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

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
    if (onToggle) onToggle(!collapsed);
  };

  const footerLinks = [
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

  return (
    <div
      className={`fixed h-screen bg-[#FFFFFF] z-50 transition-all duration-300 ease-in-out ${
        collapsed ? "w-[72px]" : "w-[260px]"
      } shadow-sm`}
    >
      {/* Header with toggle */}
      <div
        className={`flex items-center h-16 py-2 px-4 border-b border-gray-200 ${
          collapsed ? "justify-start pl-3" : "justify-between"
        }`}
      >
        {!collapsed && (
          <div className="flex items-center">
            <button
              className="p-2 rounded-full hover:bg-gray-100 mr-2"
              onClick={toggleSidebar}
            >
              <Menu className="h-5 w-5 text-gray-700" />
            </button>
            <h2 className="text-lg font-black text-indigo-600 whitespace-nowrap">
              Skillfinix
            </h2>
          </div>
        )}
        {collapsed && (
          <div className="flex items-center gap-1">
            <button
              className="p-2 rounded-full hover:bg-gray-100"
              onClick={toggleSidebar}
            >
              <Menu className="h-5 w-5 text-gray-700" />
            </button>
            <h2 className="text-lg font-black text-indigo-600 whitespace-nowrap">
              Skillfinix
            </h2>
          </div>
        )}
      </div>

      {/* Scrollable content area */}
      <div className="h-[calc(100%-64px)] overflow-y-auto thin-scrollbar pb-4">
        {/* Primary Navigation - Always visible */}
        <div className="pt-2">
          {navItems.primary.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={getNavLinkClass}
            >
              {({ isActive }) => (
                <>
                  <span
                    className={isActive ? "text-indigo-600" : "text-gray-600"}
                  >
                    {item.icon}
                  </span>
                  {collapsed ? (
                    <span className="text-[10px] mt-1 text-center whitespace-nowrap">
                      {item.label}
                    </span>
                  ) : (
                    <span className="ml-3 text-sm">{item.label}</span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Divider - Only show when not collapsed */}
        {!collapsed && (
          <div className="my-2 border-t border-gray-200 mx-4"></div>
        )}

        {/* You section - Always visible */}
        {collapsed ? (
          <div className="pt-1">
            <NavLink to="/profile" className={getNavLinkClass}>
              {({ isActive }) => (
                <>
                  <span
                    className={isActive ? "text-indigo-600" : "text-gray-600"}
                  >
                    <User className="h-5 w-5" />
                  </span>
                  <span className="text-[10px] mt-1 text-center whitespace-nowrap">
                    You
                  </span>
                </>
              )}
            </NavLink>
          </div>
        ) : (
          <>
            <div className="px-4 py-2 mb-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="ml-3 text-sm font-medium">You</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div className="pl-6 pr-2">
              {navItems.you.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center py-2 my-1 px-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={
                          isActive ? "text-indigo-600" : "text-gray-600"
                        }
                      >
                        {item.icon}
                      </span>
                      <span className="ml-3 text-sm">{item.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </>
        )}

        {/* Only show these sections when expanded */}
        {!collapsed && (
          <>
            {/* Divider */}
            <div className="my-2 border-t border-gray-200 mx-4"></div>
            {/* Discover Section */}
            <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Discover
            </div>
            <div className="py-1">
              {navItems.discover.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.path}
                  className={getNavLinkClass}
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={
                          isActive ? "text-indigo-600" : "text-gray-600"
                        }
                      >
                        {item.icon}
                      </span>
                      <span className="ml-3 text-sm">{item.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
            {/* Recent Courses Section */}
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
              {/* Mock data for recent courses */}
              {[
                {
                  id: 1,
                  title: "JavaScript Fundamentals",
                  progress: 67,
                  instructor: "Alex Morgan",
                  thumbnail: "/api/placeholder/40/40",
                },
                {
                  id: 2,
                  title: "UI Design Essentials",
                  progress: 42,
                  instructor: "Jamie Chen",
                  thumbnail: "/api/placeholder/40/40",
                },
              ].map((course) => (
                <div
                  key={course.id}
                  className="flex items-center p-2 mb-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() =>
                    console.log(`Navigating to course ${course.id}`)
                  }
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
            {/* Divider */}
            <div className="my-2 border-t border-gray-200 mx-4"></div>
            {/* Recent Barters/Swaps Section */}
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
              {/* Mock data for barters */}
              {[
                {
                  id: 1,
                  name: "Alex Morgan",
                  skill: "JavaScript",
                  avatar: "/api/placeholder/40/40",
                },
                {
                  id: 2,
                  name: "Jamie Chen",
                  skill: "UI Design",
                  avatar: "/api/placeholder/40/40",
                },
              ].map((user) => (
                <div
                  key={user.id}
                  className="flex items-center p-2 mb-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() =>
                    console.log(`Navigating to user profile ${user.id}`)
                  }
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
                    <p className="text-xs text-gray-500 truncate">
                      {user.skill}
                    </p>
                  </div>
                </div>
              ))}
              <button className="flex items-center w-full py-2 px-3 text-xs font-medium text-indigo-600 bg-white border border-indigo-300 rounded-lg hover:bg-indigo-50 transition-colors mt-2">
                <Users className="h-3 w-3 mr-2" />
                Find More SkillBarters
              </button>
            </div>
            {/* Divider */}
            <div className="my-2 border-t border-gray-200 mx-4"></div>
            {/* Admin Section */}
            <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Profile & Admin
            </div>
            <div className="py-1">
              {navItems.admin.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.path}
                  className={getNavLinkClass}
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={
                          isActive ? "text-indigo-600" : "text-gray-600"
                        }
                      >
                        {item.icon}
                      </span>
                      <span className="ml-3 text-sm">{item.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
            {/* Quick Actions */}
            <div className="p-4 mt-3 mb-4 bg-indigo-50 rounded-lg border border-indigo-100 mx-4">
              <h4 className="text-sm font-medium text-gray-800 mb-3 text-center">
                Quick Actions
              </h4>
              <div className="space-y-2">
                <button className="flex items-center justify-center w-full py-2 px-3 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
                  <Video className="h-4 w-4 mr-2" />
                  Start Learning
                </button>
                <button className="flex items-center justify-center w-full py-2 px-3 text-sm font-medium text-indigo-600 bg-white border border-indigo-300 rounded-lg hover:bg-indigo-50 transition-colors">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Course
                </button>
              </div>
            </div>
            {/* Footer Links */}
            <div className="px-4 py-3">
              <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-gray-500">
                {footerLinks.map((link, index) => (
                  <NavLink
                    key={index}
                    to={link.path}
                    className="hover:text-gray-700"
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
              <div className="mt-4 text-xs text-gray-500">
                © 2025 Skillfinix LLC
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;