import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'; 
import Sidebar from './components/Sidebar/Sidebar.jsx';
import HomePage from './components/HomePage/LandingPage.jsx';
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
        setSidebarCollapsed(false);
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
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Empty div for sidebar space reservation */}
      <div className={`flex-shrink-0 ${
        sidebarCollapsed ? 'w-[72px]' : 'w-[260px]'
      } transition-all duration-300`}></div>
      
      {/* Sidebar component - positioned absolutely */}
      <Sidebar onToggle={handleSidebarToggle} />
      
      {/* Main content area - full width with no margin */}
      <main className="flex-1 overflow-auto h-full">
        <Routes>
          {/* Home route */}
          <Route path="/" element={<HomePage />} />
          
          {/* Skill Barters route */}
          <Route path="/barters" element={<SkillBartersPage />} />
          
          {/* Explore route */}
          <Route path="/explore" element={
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Explore</h1>
              <p>Explore Skills Content</p>
            </div>
          } />
          
          {/* Trending route */}
          <Route path="/trending" element={
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Trending</h1>
              <p>Trending Skills Content</p>
            </div>
          } />
          
          {/* User Profile route */}
          <Route path="/profile" element={
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">User Profile</h1>
              <p>User Profile Content</p>
            </div>
          } />
          
          {/* Add other routes here */}
        </Routes>
      </main>
    </div>
  );
};

export default App;