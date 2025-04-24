import SidebarHeader from "./SidebarHeader";
import PrimaryNav from "./PrimaryNav";
import React, { useState, useEffect} from "react";
import UserSection from "../sections/UserSection";
import AdminSection from "../sections/AdminSection";
import DiscoverSection from "../sections/DiscoverSection";
import QuickActionsSection from "../sections/QuickActionsSection";
import RecentCoursesSection from "../sections/RecentCoursesSection";
import RecentBartersSection from "../sections/RecentBartersSection";
import FooterLinks from "../FooterLinks";

const Sidebar = ({ onToggle, collapsed: propCollapsed }) => {
  const [collapsed, setCollapsed] = useState(propCollapsed ?? false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Sync with parent component's state if provided
  useEffect(() => {
    if (propCollapsed !== undefined) {
      setCollapsed(propCollapsed);
    }
  }, [propCollapsed]);

  // Track window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Remove the automatic collapsing on small screens
      // This allows the hamburger menu to work on all screen sizes
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [onToggle]);

  const toggleSidebar = () => {
    const newCollapsedState = !collapsed;
    setCollapsed(newCollapsedState);
    if (onToggle) onToggle(newCollapsedState);
  };

  return (
    <div
      className={`fixed h-screen bg-white z-50 transition-all duration-300 ease-in-out ${
        collapsed ? "w-[72px]" : "w-[260px]"
      } shadow-sm`}
    >
      {/* Header with toggle */}
      <SidebarHeader collapsed={collapsed} toggleSidebar={toggleSidebar} />

      {/* Scrollable content area */}
      <div className="h-[calc(100%-64px)] overflow-y-auto thin-scrollbar pb-4">
        {/* Primary Navigation */}
        <PrimaryNav collapsed={collapsed} />

        {/* Divider - Only show when not collapsed */}
        {!collapsed && (
          <div className="my-2 border-t border-gray-200 mx-4"></div>
        )}

        {/* You section */}
        <UserSection collapsed={collapsed} />

        {/* Only show these sections when expanded */}
        {!collapsed && (
          <>
            {/* Divider */}
            <div className="my-2 border-t border-gray-200 mx-4"></div>
            {/* Discover Section */}
            <DiscoverSection />
            {/* Recent Courses Section */}
            <RecentCoursesSection />
            {/* Divider */}
            <div className="my-2 border-t border-gray-200 mx-4"></div>
            {/* Recent Barters/Swaps Section */}
            <RecentBartersSection />
            {/* Divider */}
            <div className="my-2 border-t border-gray-200 mx-4"></div>
            {/* Admin Section */}
            <AdminSection />
            {/* Quick Actions */}
            <QuickActionsSection />
            {/* Footer Links */}
            <FooterLinks />
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;