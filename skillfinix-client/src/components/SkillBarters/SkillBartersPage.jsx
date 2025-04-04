import React, { useState, useEffect } from 'react';
import { User, MessageSquare, Clock, Award, ChevronRight } from 'react-feather';

const SkillBartersPage = () => {
  // Mock data - replace with your API call
  const [barterUsers, setBarterUsers] = useState([
    { 
      id: 1, 
      name: 'Alex Morgan', 
      skills: ['JavaScript', 'React', 'Node.js'],
      learningSkills: ['UI Design', 'Python'],
      avatar: '/api/placeholder/60/60',
      rating: 4.8,
      completedSwaps: 12,
      lastActive: '2 hours ago'
    },
    { 
      id: 2, 
      name: 'Jamie Chen', 
      skills: ['UI Design', 'Figma', 'UX Research'],
      learningSkills: ['JavaScript', 'React Native'],
      avatar: '/api/placeholder/60/60',
      rating: 4.9,
      completedSwaps: 24,
      lastActive: '4 days ago'
    },
    { 
      id: 3, 
      name: 'Taylor Reed', 
      skills: ['Python', 'Data Science', 'Machine Learning'],
      learningSkills: ['JavaScript', 'Web Development'],
      avatar: '/api/placeholder/60/60',
      rating: 4.7,
      completedSwaps: 8,
      lastActive: '1 day ago'
    },
    { 
      id: 4, 
      name: 'Jordan Lee', 
      skills: ['Digital Marketing', 'SEO', 'Content Creation'],
      learningSkills: ['Video Editing', 'Graphic Design'],
      avatar: '/api/placeholder/60/60',
      rating: 4.6,
      completedSwaps: 15,
      lastActive: 'Just now'
    }
  ]);

  const [selectedTab, setSelectedTab] = useState('active');

  const handleRequestTeaching = (userId) => {
    console.log(`Requesting teaching session with user ${userId}`);
    // Implement your request logic here
  };

  const handleViewProfile = (userId) => {
    console.log(`Viewing profile of user ${userId}`);
    // Navigate to user profile
    // navigate(`/user/${userId}`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Skill Barters</h1>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          Find New SkillBarters
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button 
          className={`pb-4 px-4 font-medium ${selectedTab === 'active' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setSelectedTab('active')}
        >
          Active Swaps
        </button>
        <button 
          className={`pb-4 px-4 font-medium ${selectedTab === 'completed' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setSelectedTab('completed')}
        >
          Completed
        </button>
        <button 
          className={`pb-4 px-4 font-medium ${selectedTab === 'teaching' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setSelectedTab('teaching')}
        >
          Teaching Requests
        </button>
        <button 
          className={`pb-4 px-4 font-medium ${selectedTab === 'learning' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setSelectedTab('learning')}
        >
          Learning Requests
        </button>
      </div>

      {/* Barter Users List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {barterUsers.map(user => (
          <div key={user.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-800">{user.name}</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Active {user.lastActive}</span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Skills to Share:</div>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Wants to Skill Hunt :</div>
                <div className="flex flex-wrap gap-2">
                  {user.learningSkills.map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-md">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Award className="h-4 w-4 text-amber-400 mr-1" />
                  <span className="text-sm font-medium">{user.rating} Rating</span>
                </div>
                <span className="text-sm text-gray-500">{user.completedSwaps} swaps completed</span>
              </div>

              <div className="flex gap-2">
                <button 
                  className="flex-1 py-2 px-3 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                  onClick={() => handleRequestTeaching(user.id)}
                >
                  Request Teaching
                </button>
                <button 
                  className="py-2 px-3 text-sm font-medium text-indigo-600 bg-white border border-indigo-300 rounded-lg hover:bg-indigo-50 transition-colors"
                  onClick={() => handleViewProfile(user.id)}
                >
                  <User className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillBartersPage;