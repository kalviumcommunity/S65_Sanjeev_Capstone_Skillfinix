import React from "react";
import { NavLink } from "react-router-dom";
import { navItems, getNavLinkClass } from "./NavData";

const PrimaryNav = ({ collapsed }) => {
  return (
    <div className="pt-2">
      {navItems.primary.map((item) => (
        <NavLink
          key={item.label}
          to={item.path}
          className={({ isActive }) => getNavLinkClass(isActive, collapsed)}
        >
          {({ isActive }) => (
            <>
              <span className={isActive ? "text-indigo-600" : "text-gray-600"}>
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
  );
};

export default PrimaryNav;