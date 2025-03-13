'use client';

import Image from 'next/image';
import { FaEye, FaThumbsUp, FaComment, FaClock } from 'react-icons/fa';
import { VideoStats } from '../lib/youtube';
import { useState } from 'react';
import VideoModal from './VideoModal';

interface VideoCardProps {
  video: VideoStats;
}

export default function VideoCard({ video }: VideoCardProps) {
  const [showModal, setShowModal] = useState(false);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDuration = (duration: string) => {
    // Convert ISO 8601 duration to human-readable format
    // Example: PT1H30M15S -> 1:30:15
    try {
      const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
      
      if (!match) return 'Unknown';
      
      const hours = match[1] ? parseInt(match[1]) : 0;
      const minutes = match[2] ? parseInt(match[2]) : 0;
      const seconds = match[3] ? parseInt(match[3]) : 0;
      
      if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      } else {
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }
    } catch (error) {
      return 'Unknown';
    }
  };

  return (
    <>
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        <div className="relative h-48 w-full">
          {video.thumbnails.high ? (
            <Image
              src={video.thumbnails.high}
              alt={video.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="bg-gray-200 dark:bg-gray-700 h-full w-full flex items-center justify-center">
              <span className="text-gray-400">No thumbnail</span>
            </div>
          )}
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            {formatDuration(video.duration)}
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-bold mb-2 line-clamp-2">{video.title}</h3>
          
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            {formatDate(video.publishedAt)}
          </p>
          
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
              <FaEye className="text-primary" />
              <span>{formatNumber(video.viewCount)} views</span>
            </div>
            
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
              <FaThumbsUp className="text-primary" />
              <span>{formatNumber(video.likeCount)} likes</span>
            </div>
            
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
              <FaComment className="text-primary" />
              <span>{formatNumber(video.commentCount)} comments</span>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <VideoModal 
          video={video} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </>
  );
} 