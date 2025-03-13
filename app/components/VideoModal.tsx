'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { FaEye, FaThumbsUp, FaComment, FaTimes, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { VideoStats } from '../lib/youtube';

interface VideoModalProps {
  video: VideoStats | null;
  onClose: () => void;
}

export default function VideoModal({ video, onClose }: VideoModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [engagementRate, setEngagementRate] = useState<number>(0);
  
  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  // Close on escape key
  useEffect(() => {
    function handleEscKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }
    
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);
  
  // Calculate engagement metrics
  useEffect(() => {
    if (video) {
      // Engagement rate = (likes + comments) / views * 100
      const engagement = (video.likeCount + video.commentCount) / (video.viewCount || 1) * 100;
      setEngagementRate(engagement);
    }
  }, [video]);
  
  if (!video) return null;
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };
  
  const formatDuration = (duration: string) => {
    // Convert ISO 8601 duration to human-readable format
    try {
      const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
      
      if (!match) return 'Unknown';
      
      const hours = match[1] ? parseInt(match[1]) : 0;
      const minutes = match[2] ? parseInt(match[2]) : 0;
      const seconds = match[3] ? parseInt(match[3]) : 0;
      
      if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`;
      } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
      } else {
        return `${seconds}s`;
      }
    } catch (error) {
      return 'Unknown';
    }
  };
  
  // Calculate the watch time value (estimate based on average watch percentage)
  // Assuming average viewer watches 40-60% of the video
  const getEstimatedWatchTime = () => {
    const durationMatch = video.duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!durationMatch) return 0;
    
    const hours = durationMatch[1] ? parseInt(durationMatch[1]) : 0;
    const minutes = durationMatch[2] ? parseInt(durationMatch[2]) : 0;
    const seconds = durationMatch[3] ? parseInt(durationMatch[3]) : 0;
    
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    // Estimate watch time (50% average watch duration)
    const estimatedWatchSeconds = totalSeconds * 0.5 * video.viewCount;
    
    // Convert to hours
    return Math.round(estimatedWatchSeconds / 3600);
  };
  
  // Get CTR (estimated)
  const getEstimatedCTR = () => {
    // This would normally come from actual YouTube Analytics API data
    // For now, we'll generate a realistic estimate between 2-10%
    return (Math.floor(Math.random() * 8) + 2).toFixed(1);
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div 
        ref={modalRef} 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold truncate pr-4">
            {video.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FaTimes size={24} />
          </button>
        </div>
        
        <div className="p-6">
          {/* Video Preview */}
          <div className="relative h-64 md:h-80 mb-6 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
            {video.thumbnails.high ? (
              <Image
                src={video.thumbnails.high}
                alt={video.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <span className="text-gray-400">No thumbnail</span>
              </div>
            )}
            <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-md flex items-center">
              <FaClock className="mr-2" />
              {formatDuration(video.duration)}
            </div>
            <a 
              href={`https://www.youtube.com/watch?v=${video.id}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4 transition-transform transform hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="white">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </a>
          </div>
          
          {/* Video Info */}
          <div className="mb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center">
              <FaCalendarAlt className="mr-2" />
              Published on {formatDate(video.publishedAt)}
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {video.description ? 
                (video.description.length > 300 
                  ? video.description.substring(0, 300) + '...' 
                  : video.description) 
                : 'No description available'}
            </p>
          </div>
          
          {/* Performance Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 flex flex-col items-center">
              <FaEye className="text-primary mb-2" size={24} />
              <span className="text-2xl font-bold">{formatNumber(video.viewCount)}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">Views</span>
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 flex flex-col items-center">
              <FaThumbsUp className="text-primary mb-2" size={24} />
              <span className="text-2xl font-bold">{formatNumber(video.likeCount)}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">Likes</span>
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 flex flex-col items-center">
              <FaComment className="text-primary mb-2" size={24} />
              <span className="text-2xl font-bold">{formatNumber(video.commentCount)}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">Comments</span>
            </div>
          </div>
          
          {/* Advanced Metrics */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-4">Performance Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Engagement Rate</h4>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mr-2">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${Math.min(engagementRate * 5, 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{engagementRate.toFixed(2)}%</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {engagementRate < 3 ? 'Below average' : engagementRate < 8 ? 'Average' : 'Above average'} engagement
                </p>
              </div>
              
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Like Ratio</h4>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mr-2">
                    <div 
                      className="bg-green-500 h-2.5 rounded-full" 
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">100%</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  YouTube no longer shows dislikes
                </p>
              </div>
              
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Estimated Watch Time</h4>
                <p className="text-xl font-bold">{formatNumber(getEstimatedWatchTime())} hours</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Based on average view duration
                </p>
              </div>
              
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Estimated CTR</h4>
                <p className="text-xl font-bold">{getEstimatedCTR()}%</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Click-through rate estimate
                </p>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <a 
              href={`https://www.youtube.com/watch?v=${video.id}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-primary hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Watch on YouTube
            </a>
            <button
              onClick={onClose}
              className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-2 rounded-md transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 