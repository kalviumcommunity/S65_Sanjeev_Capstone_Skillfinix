import React from "react";
import { NavLink } from "react-router-dom";
import { footerLinks } from "./core/NavData";

const FooterLinks = () => {
  return (
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
  );
};

export default FooterLinks;