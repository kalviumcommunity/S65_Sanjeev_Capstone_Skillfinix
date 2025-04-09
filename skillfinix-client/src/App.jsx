// App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'; 
import Sidebar from './components/Sidebar/Sidebar';
import LandingPage from './components/HomePage/LandingPage';
import SkillBartersSection from './components/SkillBarters/SkillBartersSection';
import Header from './components/HomePage/Header/Header';
import './index.css'; 

const App = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Listen for screen size changes
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial state
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toggle sidebar callback
  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar Component */}
      <Sidebar 
        onToggle={handleSidebarToggle} 
        collapsed={sidebarCollapsed}
      />
      
      {/* Main Content Area with dynamic width adjustment */}
      <div 
  className={`flex-1 transition-all duration-300 flex flex-col overflow-hidden ${
    sidebarCollapsed ? 'ml-[72px]' : 'ml-[260px]'
  }`}
>
        <Routes>
          {/* Home/Landing route */}
          <Route 
            path="/" 
            element={
              <LandingPage 
                sidebarCollapsed={sidebarCollapsed} 
                isMobile={isMobile}
              />
            } 
          />
          
          {/* Other routes - with consistent header + scrollable content structure */}
          <Route 
            path="/barters" 
            element={
              <div className="flex flex-col h-screen">
                <Header sidebarCollapsed={sidebarCollapsed} />
                <div className="flex-1 overflow-y-auto pt-11 sm:pt-20 p-6 pb-16">
                  <SkillBartersSection />
                </div>
              </div>
            } 
          />
          
          {/* Explore route */}
          <Route 
            path="/explore" 
            element={
              <div className="flex flex-col h-screen">
                <Header sidebarCollapsed={sidebarCollapsed} />
                <div className="flex-1 overflow-y-auto pt-11 sm:pt-20 p-6 pb-16">
                  <h1 className="text-2xl font-bold mb-4">Explore</h1>
                  <p>Explore Skills Content</p>
                </div>
              </div>
            } 
          />
          
          {/* Trending route */}
          <Route 
            path="/trending" 
            element={
              <div className="flex flex-col h-screen">
                <Header sidebarCollapsed={sidebarCollapsed} />
                <div className="flex-1 overflow-y-auto pt-11 sm:pt-20 p-6 pb-16">
                  <h1 className="text-2xl font-bold mb-4">Trending</h1>
                  <p>Trending Skills Content</p>
                </div>
              </div>
            } 
          />
          
          {/* User Profile route */}
          <Route 
            path="/profile" 
            element={
              <div className="flex flex-col h-screen">
                <Header sidebarCollapsed={sidebarCollapsed} />
                <div className="flex-1 overflow-y-auto pt-11 sm:pt-20 p-6 pb-16">
                  <h1 className="text-2xl font-bold mb-4">User Profile</h1>
                  <p>User Profile Content</p>
                </div>
              </div>
            } 
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;