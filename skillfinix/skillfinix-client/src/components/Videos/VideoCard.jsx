import React from 'react';
import { Play, Clock, Eye, ThumbsUp } from 'react-feather';

const VideoCard = ({ video }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={video.thumbnail || '/placeholder-video-thumbnail.jpg'}
          alt={video.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black bg-opacity-50 rounded-full p-3">
            <Play className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 line-clamp-2">{video.title}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{video.description}</p>
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            {video.skill}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <Eye className="h-4 w-4 mr-1" />
            <span>{video.views}</span>
          </div>
          <div className="flex items-center">
            <ThumbsUp className="h-4 w-4 mr-1" />
            <span>{video.likes.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;