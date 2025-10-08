import React from "react";

const WelcomeSection = () => {
  return (
    <section className="mb-6 sm:mb-8">
      <h2 className="mb-3 text-lg font-bold text-gray-800 sm:text-xl sm:mb-4">
        Hi Nikhil Pagadala 👋
      </h2>
      <div className="overflow-hidden rounded-lg shadow-md bg-gradient-to-r from-indigo-500 to-purple-600 sm:rounded-xl">
        <div className="md:flex">
          <div className="p-4 sm:p-6 md:p-8 md:w-1/2">
            <h3 className="mb-1 text-xl font-bold text-white sm:text-2xl sm:mb-2">
              Continue Your Learning Journey
            </h3>
            <p className="mb-4 text-sm text-indigo-100 sm:mb-6 sm:text-base">
              You're making great progress! Pick up where you left off.
            </p>
            <button className="px-4 sm:px-6 py-1.5 sm:py-2 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors text-sm sm:text-base">
              Resume Learning
            </button>
          </div>
          <div className="flex items-center justify-center p-4 bg-indigo-800 md:w-1/2 sm:p-6 md:p-8">
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