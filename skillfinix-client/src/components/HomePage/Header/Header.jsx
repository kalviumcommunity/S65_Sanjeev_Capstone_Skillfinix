import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Bell,
  Plus,
  User,
  Mic,
  Upload,
  Film,
  BookOpen,
  Camera,
  X,
  Menu,
} from "react-feather";
import NotificationMenu from "./NotificationMenu";
import ProfileMenu from "./ProfileMenu";

const Header = ({ darkMode = false, sidebarCollapsed = true }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showClearButton, setShowClearButton] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isSmallView, setIsSmallView] = useState(false);
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

    // Handle responsive behavior on resize
    const handleResize = () => {
      const width = window.innerWidth;
      const effectiveWidth = sidebarCollapsed ? width - 72 : width - 260;
      
      // Calculate responsive breakpoints based on effective width
      setIsMobileView(width < 800);
      setIsSmallView(effectiveWidth < 600);
      
      // Set collapsed state based on screen width
      if (width > 768) {
        setIsCollapsed(false);
      } else {
        setIsCollapsed(true);
      }
    };

    handleResize(); // Initialize on load
    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarCollapsed]);

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

  // Calculate placeholder text based on available width
  const getPlaceholderText = () => {
    if (isMobileView) return "Search...";
    if (!sidebarCollapsed && window.innerWidth < 1100) return "Search...";
    return "Search courses, skills, users...";
  };

  // Suggestions based on current input
  const filteredSuggestions = searchQuery
    ? searchHistory.filter((item) =>
        item.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : searchHistory;

  // Determine if we should show the create button text
  const showCreateText = !isSmallView && window.innerWidth > (sidebarCollapsed ? 900 : 1000);

  return (
    <header className={`${darkMode ? 'bg-gray-100/95' : 'bg-white'} shadow-sm fixed top-0 right-0 z-50 flex items-center px-2 sm:px-4 transition-colors duration-300 h-14 sm:h-16 overflow-visible`}
      style={{
        left: sidebarCollapsed ? '72px' : '260px',
        transition: 'left 0.3s ease-in-out'
      }}
    >
      <div className="flex items-center justify-between w-full max-w-full">
        {/* Left Section: Logo/Menu - Fixed width to prevent collapsing */}
        <div className="flex items-center w-24 sm:w-32 md:w-40 flex-shrink-0">
          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Center Section: Search - With flex-1 to take remaining space but adjust with sidebar state */}
        <div className={`flex justify-center flex-1 px-2 transition-all duration-300`}>
          <div className={`relative w-full max-w-xl transition-all duration-300`}>
            <form
              onSubmit={handleSearchSubmit}
              className="flex w-full items-center"
            >
              <div
                className={`flex flex-1 border rounded-l-full h-9 sm:h-10 overflow-hidden transition-all ${
                  isFocused ? "border-blue-500 shadow-sm" : "border-gray-300"
                }`}
              >
                <div className="flex items-center flex-grow overflow-hidden bg-white w-full">
                  {isFocused && (
                    <div className="pl-2 sm:pl-4 flex items-center h-full flex-shrink-0 text-blue-500">
                      <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                  )}
                  <input
                    ref={inputRef}
                    type="text"
                    className={`py-1 sm:py-2 ${
                      isFocused ? "pl-1 sm:pl-2" : "pl-2 sm:pl-4"
                    } pr-2 sm:pr-4 w-full outline-none text-xs sm:text-sm h-full border-none`}
                    placeholder={getPlaceholderText()}
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
                      <X className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className={`h-9 sm:h-10 px-3 sm:px-5 border border-gray-300 rounded-r-full flex items-center justify-center flex-shrink-0 ${
                  darkMode ? "bg-gray-200 text-gray-700 hover:bg-gray-300" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Search className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>

              {/* Always show the microphone button, but make it responsive */}
              <button
                type="button"
                className={`ml-2 h-9 sm:h-10 w-9 sm:w-10 rounded-full ${
                  darkMode ? "bg-gray-200 hover:bg-gray-300" : "bg-gray-100 hover:bg-gray-200"
                } flex items-center justify-center flex-shrink-0 ${isSmallView ? 'hidden sm:flex' : 'flex'}`}
                title="Search with your voice"
              >
                <Mic className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
              </button>
            </form>

            {isFocused && (
              <div
                ref={searchDropdownRef}
                className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden max-h-64 sm:max-h-96 overflow-y-auto"
              >
                {filteredSuggestions.length > 0 ? (
                  <ul>
                    {filteredSuggestions.map((item, index) => (
                      <li
                        key={index}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                        onClick={() => handleHistoryItemClick(item)}
                      >
                        <Search className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 mr-2 sm:mr-3 flex-shrink-0" />
                        <span className="text-xs sm:text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-3 sm:p-4 text-xs sm:text-sm text-gray-500">
                    No recent searches
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Section: User Actions - Fixed width to prevent shifting */}
        <div className="flex items-center gap-x-1 sm:gap-x-2 lg:gap-x-3 ml-1 sm:ml-2 w-24 sm:w-32 md:w-48 justify-end flex-shrink-0">
          {/* Always show Create button but make it responsive */}
          <div className="relative">
            <button
              className={`h-8 sm:h-10 ${showCreateText ? 'px-2 sm:px-4' : 'w-8 sm:w-10'} rounded-full ${
                darkMode ? "bg-gray-200 hover:bg-gray-300" : "bg-gray-100 hover:bg-gray-200"
              } create-trigger flex items-center justify-center transition-all duration-300`}
              onClick={() => setShowCreateMenu(!showCreateMenu)}
              aria-label="Create"
              title="Create"
            >
              <div className="flex items-center justify-center space-x-1">
                <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
                {showCreateText && (
                  <span className="text-xs sm:text-sm font-medium text-gray-700">
                    Create
                  </span>
                )}
              </div>
            </button>

            {showCreateMenu && (
              <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-lg shadow-lg py-2 z-50 create-dropdown">
                <a
                  href="#"
                  className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Upload className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0" />
                  Upload Video
                </a>
                <a
                  href="#"
                  className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Film className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0" />
                  Go Live
                </a>
                <a
                  href="#"
                  className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100"
                >
                  <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0" />
                  Create Course
                </a>
                <a
                  href="#"
                  className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Camera className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0" />
                  Create Post
                </a>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              className={`w-8 sm:w-10 h-8 sm:h-10 rounded-full ${
                darkMode ? "hover:bg-gray-200" : "hover:bg-gray-100"
              } notifications-trigger flex items-center justify-center`}
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
            >
              <div className="relative">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-3 w-3 sm:h-4 sm:w-4 flex items-center justify-center text-[10px] sm:text-xs">
                  2
                </span>
              </div>
            </button>

            {showNotifications && <NotificationMenu />}
          </div>

          <div className="relative">
            <button
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center hover:bg-indigo-200 transition-colors profile-trigger"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
              <User className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            {showProfileDropdown && <ProfileMenu />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;