import React from "react";
import { Menu } from "react-feather";

const SidebarHeader = ({ collapsed, toggleSidebar }) => {
  return (
    <div
      className={`flex items-center h-16 py-2 border-b border-gray-200 ${
        collapsed ? "px-3" : "px-4"
      } justify-between`}
    >
      <div className="flex items-center">
        <button
          className="p-2 rounded-full hover:bg-gray-100"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5 text-gray-700" />
        </button>
        
        {/* Always show logo, with reduced size when collapsed */}
        <h2 className={`font-black text-indigo-600 whitespace-nowrap ml-1 ${
          collapsed ? "text-base" : "text-lg"
        }`}>
          Skillfinix
        </h2>
      </div>
    </div>
  );
};

export default SidebarHeader;