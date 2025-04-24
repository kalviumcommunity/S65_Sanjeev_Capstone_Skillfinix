import React from "react";

const WelcomeSection = () => {
  return (
    <section className="mb-6 sm:mb-8">
      <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">
        Hi Nikhil Pagadala 👋
      </h2>
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg sm:rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="p-4 sm:p-6 md:p-8 md:w-1/2">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">
              Continue Your Learning Journey
            </h3>
            <p className="text-indigo-100 mb-4 sm:mb-6 text-sm sm:text-base">
              You're making great progress! Pick up where you left off.
            </p>
            <button className="px-4 sm:px-6 py-1.5 sm:py-2 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors text-sm sm:text-base">
              Resume Learning
            </button>
          </div>
          <div className="md:w-1/2 bg-indigo-800 p-4 sm:p-6 md:p-8 flex items-center justify-center">
            <img
              src="/api/placeholder/400/200"
              alt="Learning illustration"
              className="max-w-full rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;