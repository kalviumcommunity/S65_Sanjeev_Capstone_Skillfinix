import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Bell,
  Plus,
  User,
  ChevronDown,
  Mic,
  Upload,
  Film,
  Camera,
  BookOpen,
  Video,
  Settings,
  X,
} from "react-feather";

const LandingPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showClearButton, setShowClearButton] = useState(false);
  const [searchHistory, setSearchHistory] = useState([
    "javascript tutorial",
    "react hooks",
    "tailwind css",
    "skill exchange platform",
  ]);

  const inputRef = useRef(null);
  const searchDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".profile-dropdown") &&
        !event.target.closest(".profile-trigger")
      ) {
        setShowProfileDropdown(false);
      }

      if (
        !event.target.closest(".notifications-dropdown") &&
        !event.target.closest(".notifications-trigger")
      ) {
        setShowNotifications(false);
      }

      if (
        !event.target.closest(".create-dropdown") &&
        !event.target.closest(".create-trigger")
      ) {
        setShowCreateMenu(false);
      }

      if (
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Mock notifications
  const notifications = [
    {
      id: 1,
      user: "Alex Morgan",
      action: "requested a skill swap",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      user: "Jamie Chen",
      action: "commented on your video",
      time: "1 day ago",
      read: false,
    },
    {
      id: 3,
      user: "Course Update",
      action: "New lesson available in JavaScript Fundamentals",
      time: "3 days ago",
      read: true,
    },
  ];

  // Handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowClearButton(e.target.value.length > 0);
  };

  // Clear search input
  const clearSearch = () => {
    setSearchQuery("");
    setShowClearButton(false);
    inputRef.current.focus();
  };

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      // Add to search history if not already there
      if (!searchHistory.includes(searchQuery.trim())) {
        setSearchHistory((prev) => [searchQuery.trim(), ...prev].slice(0, 8));
      }
      setIsFocused(false);
      // Implement search functionality
    }
  };

  // Handle history item click
  const handleHistoryItemClick = (query) => {
    setSearchQuery(query);
    setShowClearButton(true);
    inputRef.current.focus();
  };

  // Suggestions based on current input
  const filteredSuggestions = searchQuery
    ? searchHistory.filter((item) =>
        item.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : searchHistory;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-white shadow-sm fixed top-0 right-0 left-0 h-16 z-40 flex items-center px-2">
        <div className="flex items-center justify-between w-full max-w-full">
          <div className="w-16 md:w-64 flex-shrink-0"></div>

          <div className="flex justify-center flex-1">
            <div className="relative w-full max-w-xl"> 
              <form
                onSubmit={handleSearchSubmit}
                className="flex w-full items-center"
              >
                <div
                  className={`flex flex-1 border rounded-l-full h-10 overflow-hidden transition-all ${
                    isFocused ? "border-blue-500 shadow-sm" : "border-gray-300"
                  }`}
                >
                  <div className="flex items-center flex-grow overflow-hidden bg-white w-full">
                    {isFocused && (
                      <div className="pl-4 flex items-center h-full flex-shrink-0 text-blue-500">
                        <Search className="h-5 w-5" />
                      </div>
                    )}
                    <input
                      ref={inputRef}
                      type="text"
                      className={`py-2 ${
                        isFocused ? "pl-2" : "pl-4"
                      } pr-4 w-full outline-none text-sm h-full border-none`}
                      placeholder="Search"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onFocus={() => setIsFocused(true)}
                    />
                    {showClearButton && (
                      <button
                        type="button"
                        className="p-1 mr-1 text-gray-500 hover:text-gray-700 h-full flex items-center flex-shrink-0"
                        onClick={clearSearch}
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="h-10 px-5 border border-gray-300 rounded-r-full flex items-center justify-center flex-shrink-0 bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  <Search className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  className="ml-4 h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center flex-shrink-0"
                  title="Search with your voice"
                >
                  <Mic className="h-5 w-5 text-gray-700" />
                </button>
              </form>

              {isFocused && (
                <div
                  ref={searchDropdownRef}
                  className="absolute top-full left-0 right-12 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden max-h-96 overflow-y-auto"
                >
                  {filteredSuggestions.length > 0 ? (
                    <ul>
                      {filteredSuggestions.map((item, index) => (
                        <li
                          key={index}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                          onClick={() => handleHistoryItemClick(item)}
                        >
                          <Search className="h-4 w-4 text-gray-400 mr-3" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-4 text-sm text-gray-500">
                      No recent searches
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-x-2 flex-shrink-0 mr-8">
            <div className="relative -mr-2">
              <button
                className="h-10 px-4 rounded-full bg-gray-100 hover:bg-gray-200 create-trigger flex items-center justify-center"
                onClick={() => setShowCreateMenu(!showCreateMenu)}
                aria-label="Create"
              >
                <div className="flex items-center justify-center space-x-1">
                  <Plus className="h-5 w-5 text-gray-700" />
                  <span className="text-sm font-medium text-gray-700">
                    Create
                  </span>
                </div>
              </button>

              {showCreateMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 create-dropdown">
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Upload className="h-5 w-5 mr-3" />
                    Upload Video
                  </a>
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Film className="h-5 w-5 mr-3" />
                    Go Live
                  </a>
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <BookOpen className="h-5 w-5 mr-3" />
                    Create Course
                  </a>
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Camera className="h-5 w-5 mr-3" />
                    Create Post
                  </a>
                </div>
              )}
            </div>

            <div className="relative ml-2">
              <button
                className="w-10 h-10 rounded-full hover:bg-gray-100 notifications-trigger flex items-center justify-center"
                onClick={() => setShowNotifications(!showNotifications)}
                aria-label="Notifications"
              >
                <div className="relative">
                  <Bell className="h-5 w-5 text-gray-700" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    2
                  </span>
                </div>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50 notifications-dropdown">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
                    <h3 className="text-sm font-medium text-gray-700">
                      Notifications
                    </h3>
                    <button className="text-xs text-indigo-600 hover:text-indigo-800">
                      Mark all as read
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 hover:bg-gray-50 border-l-4 ${
                          notification.read
                            ? "border-transparent"
                            : "border-indigo-500"
                        }`}
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mr-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200">
                              <img
                                src="/api/placeholder/40/40"
                                alt=""
                                className="w-full h-full object-cover rounded-full"
                              />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-800">
                              <span className="font-medium">
                                {notification.user}
                              </span>{" "}
                              {notification.action}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-gray-100">
                    <a
                      href="/notifications"
                      className="block text-center text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      View all notifications
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center hover:bg-indigo-200 transition-colors profile-trigger"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              >
                <User className="h-5 w-5" />
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-50 profile-dropdown">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center">
                          <User className="h-6 w-6" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          John Doe
                        </p>
                        <p className="text-xs text-gray-500">
                          john.doe@example.com
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="py-1">
                    <a
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Your Profile
                    </a>
                    <a
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </a>
                    <a
                      href="/help"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Help & Support
                    </a>
                    <a
                      href="/logout"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 mt-16 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Featured Section */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Welcome Back John
            </h2>
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-md overflow-hidden">
              <div className="md:flex">
                <div className="p-8 md:w-1/2">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Continue Your Learning Journey
                  </h3>
                  <p className="text-indigo-100 mb-6">
                    You're making great progress! Pick up where you left off.
                  </p>
                  <button className="px-6 py-2 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors">
                    Resume Learning
                  </button>
                </div>
                <div className="md:w-1/2 bg-indigo-800 p-8 flex items-center justify-center">
                  <img
                    src="/api/placeholder/400/200"
                    alt="Learning illustration"
                    className="max-w-full rounded-lg"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Continue Learning Section */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Continue Learning
              </h2>
              <a
                href="/courses"
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                View All
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="h-36 bg-gray-200 relative">
                    <img
                      src={`/api/placeholder/320/180`}
                      alt={`Course ${item}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-indigo-900 text-white text-xs px-2 py-1 rounded">
                      {Math.floor(Math.random() * 30) + 10}m left
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-800 mb-1 line-clamp-2">
                      JavaScript Fundamentals: From Zero to Hero
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">Alex Morgan</p>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full">
                      <div
                        className="h-1.5 bg-indigo-600 rounded-full"
                        style={{
                          width: `${Math.floor(Math.random() * 80) + 20}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recommended Section */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Recommended for You
              </h2>
              <a
                href="/explore"
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                Explore More
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="h-36 bg-gray-200">
                    <img
                      src={`/api/placeholder/320/180`}
                      alt={`Course ${item}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-800 mb-1 line-clamp-2">
                      UI Design Principles for Developers
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">Jamie Chen</p>
                    <div className="flex items-center text-sm">
                      <div className="flex items-center text-amber-400 mr-2">
                        ★★★★★
                        <span className="ml-1 text-gray-600">4.8</span>
                      </div>
                      <span className="text-gray-500">(342 reviews)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Skill Barters Section */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Top Skill Barters
              </h2>
              <a
                href="/barters"
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                View All
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden p-4"
                >
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                      <img
                        src="/api/placeholder/50/50"
                        alt="User avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-md font-medium text-gray-800">
                        Alex Morgan
                      </h3>
                      <div className="flex items-center text-sm text-amber-500">
                        ★★★★★
                        <span className="ml-1 text-gray-600">4.9</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-2">
                      <div className="text-xs font-medium text-gray-500 mb-1">
                        Skills to Share:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-md">
                          JavaScript
                        </span>
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-md">
                          React
                        </span>
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-md">
                          Node.js
                        </span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="text-xs font-medium text-gray-500 mb-1">
                        Looking to Learn:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-md">
                          UI Design
                        </span>
                        <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-md">
                          Python
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="w-full py-1.5 px-3 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;