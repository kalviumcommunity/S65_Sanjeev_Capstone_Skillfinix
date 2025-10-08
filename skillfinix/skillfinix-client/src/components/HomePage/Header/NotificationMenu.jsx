
import React from "react";

const NotificationMenu = () => {
  // Mock notifications
  const notifications = [
    {
      id: 1,
      user: "Abhinav Rahul",
      action: "requested a skill swap",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      user: "Akshit Sharma",
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

  return (
    <div className="absolute right-0 mt-2 w-64 sm:w-80 bg-white rounded-lg shadow-lg py-2 z-50 notifications-dropdown">
      <div className="flex items-center justify-between px-3 sm:px-4 py-1.5 sm:py-2 border-b border-gray-100">
        <h3 className="text-xs sm:text-sm font-medium text-gray-700">
          Notifications
        </h3>
        <button className="text-[10px] sm:text-xs text-indigo-600 hover:text-indigo-800">
          Mark all as read
        </button>
      </div>
      <div className="max-h-64 sm:max-h-96 overflow-y-auto">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-50 border-l-4 ${
              notification.read
                ? "border-transparent"
                : "border-indigo-500"
            }`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-2 sm:mr-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200">
                  <img
                    src="/api/placeholder/40/40"
                    alt=""
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-gray-800">
                  <span className="font-medium">
                    {notification.user}
                  </span>{" "}
                  {notification.action}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
                  {notification.time}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="px-3 sm:px-4 py-1.5 sm:py-2 border-t border-gray-100">
        <a
          href="/notifications"
          className="block text-center text-xs sm:text-sm text-indigo-600 hover:text-indigo-800"
        >
          View all notifications
        </a>
      </div>
    </div>
  );
};

export default NotificationMenu;