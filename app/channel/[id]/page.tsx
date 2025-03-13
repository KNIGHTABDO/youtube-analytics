'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { FaUser, FaVideo, FaEye, FaSpinner, FaCalendarAlt } from 'react-icons/fa';
import { getChannelStats, getChannelVideos, ChannelStats, VideoStats } from '../../lib/youtube';
import { useChannelStore } from '../../lib/store';
import VideoCard from '../../components/VideoCard';
import ChannelAnalytics from '../../components/ChannelAnalytics';

export default function ChannelPage() {
  const params = useParams();
  const channelId = params.id as string;
  const { selectedChannel, channelVideos, setSelectedChannel, setChannelVideos, setIsLoading, isLoading, error, setError } = useChannelStore();

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch channel details
        const channelData = await getChannelStats(channelId);
        if (!channelData) {
          setError('Channel not found');
          return;
        }
        setSelectedChannel(channelData);
        
        // Fetch channel videos
        const videos = await getChannelVideos(channelId);
        setChannelVideos(videos);
      } catch (error) {
        console.error('Error fetching channel data:', error);
        setError('Failed to load channel data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchChannelData();
    
    // Cleanup function
    return () => {
      setSelectedChannel(null);
      setChannelVideos([]);
    };
  }, [channelId, setSelectedChannel, setChannelVideos, setIsLoading, setError]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <FaSpinner className="animate-spin text-primary text-4xl" />
      </div>
    );
  }

  if (error || !selectedChannel) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4">
          {error || 'Channel not found'}
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Please try searching for a different channel.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Channel Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <div className="relative h-32 w-32 rounded-full overflow-hidden flex-shrink-0">
            {selectedChannel.thumbnails.high ? (
              <Image
                src={selectedChannel.thumbnails.high}
                alt={selectedChannel.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="bg-gray-200 dark:bg-gray-700 h-full w-full flex items-center justify-center">
                <FaUser className="text-gray-400 text-4xl" />
              </div>
            )}
          </div>
          
          <div className="flex-grow text-center md:text-left">
            <h1 className="text-3xl font-bold mb-2">{selectedChannel.title}</h1>
            
            {selectedChannel.customUrl && (
              <p className="text-primary mb-2">
                {selectedChannel.customUrl}
              </p>
            )}
            
            <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-4">
              <div className="flex items-center gap-2">
                <FaUser className="text-primary" />
                <span className="font-semibold">{formatNumber(selectedChannel.subscriberCount)}</span>
                <span className="text-gray-500 dark:text-gray-400">subscribers</span>
              </div>
              
              <div className="flex items-center gap-2">
                <FaVideo className="text-primary" />
                <span className="font-semibold">{formatNumber(selectedChannel.videoCount)}</span>
                <span className="text-gray-500 dark:text-gray-400">videos</span>
              </div>
              
              <div className="flex items-center gap-2">
                <FaEye className="text-primary" />
                <span className="font-semibold">{formatNumber(selectedChannel.viewCount)}</span>
                <span className="text-gray-500 dark:text-gray-400">views</span>
              </div>
              
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-primary" />
                <span className="text-gray-500 dark:text-gray-400">Joined {formatDate(selectedChannel.publishedAt)}</span>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl">
              {selectedChannel.description || 'No description available'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Analytics Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Channel Analytics</h2>
        <ChannelAnalytics channel={selectedChannel} videos={channelVideos} />
      </div>
      
      {/* Popular Videos Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Popular Videos</h2>
        
        {channelVideos.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 py-4">
            No videos found for this channel.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {channelVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 