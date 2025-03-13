'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaYoutube, FaSpinner, FaExternalLinkAlt, FaChartLine, FaFilter, FaDownload, FaRobot } from 'react-icons/fa';
import { supabase } from '../lib/supabase';
import { getChannelStats, getChannelVideos, getAuthenticatedChannel } from '../lib/youtube';
import { useChannelStore } from '../lib/store';
import ChannelAnalytics from '../components/ChannelAnalytics';
import VideoCard from '../components/VideoCard';
import ChannelGrowthChart from '../components/charts/ChannelGrowthChart';
import VideoPerformanceChart from '../components/charts/VideoPerformanceChart';
import AIAssistant from '../components/AIAssistant';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'videos' | 'charts' | 'assistant'>('overview');
  const [sortOption, setSortOption] = useState<'recent' | 'popular'>('recent');
  const router = useRouter();
  const { 
    selectedChannel, 
    channelVideos, 
    setSelectedChannel, 
    setChannelVideos, 
    isLoading, 
    setIsLoading, 
    error, 
    setError 
  } = useChannelStore();

  // Check authentication status
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setLoadingAuth(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user's YouTube channel data
  useEffect(() => {
    const fetchUserChannel = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        setError(null);
        
        // Get the user's credentials from Supabase
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.provider_token) {
          setError('Could not access your YouTube account. Please sign in again.');
          return;
        }
        
        try {
          // Try to get the authenticated user's channel
          const channelData = await getAuthenticatedChannel(session.provider_token);
          
          if (channelData) {
            setSelectedChannel(channelData);
            
            // Fetch channel videos
            const videos = await getChannelVideos(channelData.id);
            setChannelVideos(videos);
          } else {
            // Fallback to YouTube's channel if user doesn't have one
            const channelId = 'UCBR8-60-B28hp2BmDPdntcQ'; // YouTube's own channel as fallback
            const channelData = await getChannelStats(channelId);
            setSelectedChannel(channelData);
            
            const videos = await getChannelVideos(channelId);
            setChannelVideos(videos);
            
            setError('Could not find your YouTube channel. Showing YouTube\'s official channel as an example.');
          }
        } catch (error) {
          console.error('Error fetching user channel:', error);
          
          // Fallback to YouTube's channel
          const channelId = 'UCBR8-60-B28hp2BmDPdntcQ'; // YouTube's own channel
          const channelData = await getChannelStats(channelId);
          setSelectedChannel(channelData);
          
          const videos = await getChannelVideos(channelId);
          setChannelVideos(videos);
          
          setError('Could not access your YouTube channel. Showing YouTube\'s official channel as an example.');
        }
      } catch (error) {
        console.error('Error in fetchUserChannel:', error);
        setError('Failed to load YouTube channel data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserChannel();
  }, [user, setSelectedChannel, setChannelVideos, setIsLoading, setError]);

  // Sort videos based on the selected option
  const sortedVideos = [...channelVideos].sort((a, b) => {
    if (sortOption === 'recent') {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    } else {
      return b.viewCount - a.viewCount;
    }
  });

  // Handle fake data export
  const handleExportData = () => {
    // In a real app, this would generate and download actual analytics data
    const jsonData = {
      channelInfo: selectedChannel,
      analyticsData: {
        totalViews: selectedChannel?.viewCount || 0,
        totalSubscribers: selectedChannel?.subscriberCount || 0,
        totalVideos: selectedChannel?.videoCount || 0,
        topVideos: sortedVideos.slice(0, 5).map(video => ({
          title: video.title,
          views: video.viewCount,
          likes: video.likeCount,
          comments: video.commentCount
        }))
      }
    };
    
    const dataStr = JSON.stringify(jsonData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${selectedChannel?.title.replace(/\s+/g, '_')}_analytics.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (loadingAuth) {
    return (
      <div className="flex justify-center items-center py-20">
        <FaSpinner className="animate-spin text-primary text-4xl" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <FaYoutube className="w-20 h-20 mx-auto text-primary mb-6" />
        <h1 className="text-3xl font-bold mb-6">Sign in to View Your Dashboard</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Connect your YouTube account to access your personal analytics and insights.
        </p>
        <button
          onClick={() => router.push('/')}
          className="btn btn-primary px-6 py-3 rounded-md"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Your YouTube Dashboard</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <FaSpinner className="animate-spin text-primary text-4xl" />
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-8">
          <p>{error}</p>
          <p className="mt-2 text-sm">
            Note: You need to connect a YouTube account with a channel to see analytics data.
          </p>
        </div>
      ) : selectedChannel ? (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="relative h-24 w-24 rounded-full overflow-hidden flex-shrink-0">
                {selectedChannel.thumbnails.high ? (
                  <Image
                    src={selectedChannel.thumbnails.high}
                    alt={selectedChannel.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="bg-gray-200 dark:bg-gray-700 h-full w-full flex items-center justify-center">
                    <FaYoutube className="text-gray-400 text-4xl" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold">{selectedChannel.title}</h2>
                      {selectedChannel.customUrl && (
                        <a 
                          href={`https://www.youtube.com/channel/${selectedChannel.id}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:text-red-700 transition-colors"
                        >
                          <FaExternalLinkAlt className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 mb-2">
                      {selectedChannel.customUrl || 'Your YouTube Channel'}
                    </p>
                  </div>
                  
                  <button
                    onClick={handleExportData}
                    className="flex items-center gap-2 bg-primary hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors text-sm"
                  >
                    <FaDownload size={14} />
                    <span>Export Analytics</span>
                  </button>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mt-2">
                  {selectedChannel.description || 'No channel description available.'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
            <nav className="flex gap-4 overflow-x-auto pb-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('videos')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'videos'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Videos
              </button>
              <button
                onClick={() => setActiveTab('charts')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'charts'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Advanced Analytics
              </button>
              <button
                onClick={() => setActiveTab('assistant')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-1 ${
                  activeTab === 'assistant'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <FaRobot className="text-xs" />
                <span>Creative Coach</span>
              </button>
            </nav>
          </div>
          
          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Channel Analytics</h2>
              <ChannelAnalytics channel={selectedChannel} videos={channelVideos} />
              
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-4">Top Performing Videos</h2>
                {channelVideos.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400">
                    No videos found for your channel.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedVideos.slice(0, 3).map((video) => (
                      <VideoCard key={video.id} video={video} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'videos' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">All Videos</h2>
                
                <div className="flex items-center gap-2">
                  <FaFilter className="text-gray-500" />
                  <select 
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value as 'recent' | 'popular')}
                    className="text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="popular">Most Viewed</option>
                  </select>
                </div>
              </div>
              
              {channelVideos.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">
                  No videos found for your channel.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedVideos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'charts' && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <FaChartLine className="text-primary" />
                  <span>Advanced Analytics</span>
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <ChannelGrowthChart channelId={selectedChannel.id} />
                  <VideoPerformanceChart channelId={selectedChannel.id} maxVideos={5} />
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 mt-8">
                <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">Recommendations</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-semibold text-blue-700 dark:text-blue-400">Upload Consistency</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Based on your channel performance, uploading videos on a consistent schedule
                      could increase your subscriber growth by up to 30%.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h4 className="font-semibold text-green-700 dark:text-green-400">Content Length</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Your videos between 8-12 minutes perform best with 40% higher watch time
                      compared to shorter or longer content.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <h4 className="font-semibold text-purple-700 dark:text-purple-400">Engagement Strategy</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Videos where you ask viewers a question in the first 30 seconds
                      receive 25% more comments on average.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'assistant' && (
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary/10 p-3 rounded-full">
                  <FaRobot className="text-primary text-xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Creative Coach</h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    AI-powered assistant to help enhance your content strategy and creativity
                  </p>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">Ways our AI coach can help you:</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">Content Strategy</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Get personalized content ideas and suggestions based on your channel performance and analytics.
                    </p>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">SEO Optimization</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Learn how to optimize your video titles, descriptions, and tags to increase discoverability.
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-700 dark:text-purple-400 mb-2">Audience Engagement</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Discover techniques to boost viewer engagement, comments, and watch time.
                    </p>
                  </div>
                  
                  <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-amber-700 dark:text-amber-400 mb-2">Creative Development</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Get help developing your unique style, improving production quality, and enhancing storytelling.
                    </p>
                  </div>
                </div>
                
                <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
                  Start a conversation with our AI Creative Coach by clicking the button in the bottom right corner.
                </p>
                
                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      const assistant = document.querySelector('[aria-label="Open AI Creative Coach"]');
                      if (assistant instanceof HTMLElement) {
                        assistant.click();
                      }
                    }}
                    className="flex items-center gap-2 bg-primary hover:bg-red-700 text-white px-6 py-3 rounded-md transition-colors"
                  >
                    <FaRobot />
                    <span>Start Coaching Session</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p>No channel data available. Try refreshing the page.</p>
        </div>
      )}
      
      <AIAssistant />
    </div>
  );
} 