import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VideoCard from './VideoCard';

const VideoGallery = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState('');

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const url = selectedSkill 
          ? `/api/videos/skill/${selectedSkill}`
          : '/api/videos';
        const res = await axios.get(url);
        setVideos(res.data.data.videos);
      } catch (err) {
        console.error('Error fetching videos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [selectedSkill]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Video Tutorials</h1>
        <select
          value={selectedSkill}
          onChange={(e) => setSelectedSkill(e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          <option value="">All Skills</option>
          <option value="JavaScript">JavaScript</option>
          <option value="React">React</option>
          <option value="UI Design">UI Design</option>
          {/* Add more skills as needed */}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoGallery;