import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'; 
import Sidebar from './components/Sidebar/Sidebar.jsx';
import SkillBartersPage from './components/SkillBarters/SkillBartersPage.jsx';
import './index.css'; 

const App = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Listen for sidebar state changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(false); // Reset to false on larger screens
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Create a callback function to update the state from the Sidebar component
  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar onToggle={handleSidebarToggle} />
      <div 
        className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-[72px]' : 'ml-[240px]'
        } p-6 relative`}
      >
        {/* Dimming overlay */}
        {!sidebarCollapsed && (
          <div className="fixed inset-0 bg-black opacity-50 z-40" />
        )}
        <Routes>
          <Route path="/" element={<div className="bg-white rounded-lg shadow-sm p-6"><h1 className="text-3xl font-bold text-indigo-700 mb-4">Skillfinix</h1><div>Home Dashboard Content</div></div>} />
          <Route path="/explore" element={<div className="bg-white rounded-lg shadow-sm p-6"><h1 className="text-3xl font-bold text-indigo-700 mb-4">Explore</h1><div>Explore Skills Content</div></div>} />
          <Route path="/trending" element={<div className="bg-white rounded-lg shadow-sm p-6"><h1 className="text-3xl font-bold text-indigo-700 mb-4">Trending</h1><div>Trending Skills Content</div></div>} />
          <Route path="/barters" element={<div className="bg-white rounded-lg shadow-sm"><SkillBartersPage /></div>} />
          <Route path="/user/:userId" element={<div className="bg-white rounded-lg shadow-sm p-6"><h1 className="text-3xl font-bold text-indigo-700 mb-4">User  Profile</h1><div>User Profile Content</div></div>} />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </div>
  );
};

export default App;