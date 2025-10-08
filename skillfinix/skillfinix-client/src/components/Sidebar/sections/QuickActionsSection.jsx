import React from "react";
import { Video, Plus } from "react-feather";

const QuickActionsSection = () => {
  return (
    <div className="p-4 mt-3 mb-4 bg-indigo-50 rounded-lg border border-indigo-100 mx-4">
      <h4 className="text-sm font-medium text-gray-800 mb-3 text-center">
        Quick Actions
      </h4>
      <div className="space-y-2">
        <button className="flex items-center justify-center w-full py-2 px-3 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
          <Video className="h-4 w-4 mr-2" />
          Start Learning
        </button>
        <button className="flex items-center justify-center w-full py-2 px-3 text-sm font-medium text-indigo-600 bg-white border border-indigo-300 rounded-lg hover:bg-indigo-50 transition-colors">
          <Plus className="h-4 w-4 mr-2" />
          Create New Course
        </button>
      </div>
    </div>
  );
};

export default QuickActionsSection;