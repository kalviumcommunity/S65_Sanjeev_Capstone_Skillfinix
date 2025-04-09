import React from "react";
import { NavLink } from "react-router-dom";
import { navItems, getNavLinkClass } from "./NavData";

const DiscoverSection = () => {
  return (
    <>
      <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
        Discover
      </div>
      <div className="py-1">
        {navItems.discover.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) => getNavLinkClass(isActive, false)}
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

export default DiscoverSection;