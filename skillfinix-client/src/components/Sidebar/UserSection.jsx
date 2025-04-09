import React from "react";
import { NavLink } from "react-router-dom";
import { User, ChevronRight } from "react-feather";
import { navItems, getNavLinkClass } from "./NavData";

const UserSection = ({ collapsed }) => {
  return collapsed ? (
    <div className="pt-1">
      <NavLink 
        to="/profile" 
        className={({ isActive }) => getNavLinkClass(isActive, collapsed)}
      >
        {({ isActive }) => (
          <>
            <span className={isActive ? "text-indigo-600" : "text-gray-600"}>
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
                  className={isActive ? "text-indigo-600" : "text-gray-600"}
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
  );
};

export default UserSection;