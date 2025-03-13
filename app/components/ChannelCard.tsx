'use client';

import Image from 'next/image';
import { FaUser, FaVideo, FaEye } from 'react-icons/fa';
import { ChannelStats } from '../lib/youtube';

interface ChannelCardProps {
  channel: ChannelStats;
  onClick: () => void;
}

export default function ChannelCard({ channel, onClick }: ChannelCardProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 rounded-full overflow-hidden flex-shrink-0">
          {channel.thumbnails.medium ? (
            <Image
              src={channel.thumbnails.medium}
              alt={channel.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="bg-gray-200 dark:bg-gray-700 h-full w-full flex items-center justify-center">
              <FaUser className="text-gray-400 text-2xl" />
            </div>
          )}
        </div>
        
        <div className="flex-grow">
          <h3 className="text-xl font-bold mb-1">{channel.title}</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-2 line-clamp-1">
            {channel.customUrl || channel.description || 'No description available'}
          </p>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
              <FaUser className="text-primary" />
              <span>{formatNumber(channel.subscriberCount)} subscribers</span>
            </div>
            
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
              <FaVideo className="text-primary" />
              <span>{formatNumber(channel.videoCount)} videos</span>
            </div>
            
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
              <FaEye className="text-primary" />
              <span>{formatNumber(channel.viewCount)} views</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 