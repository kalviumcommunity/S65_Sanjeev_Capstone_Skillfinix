import React from "react";
import { User } from "react-feather";

const ProfileMenu = () => {
  return (
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
            Nikhil Pagadala
            </p>
            <p className="text-xs text-gray-500">
            NikhilPagadala11@example.com
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
  );
};

export default ProfileMenu;