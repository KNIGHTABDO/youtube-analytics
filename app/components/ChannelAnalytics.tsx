'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { ChannelStats, VideoStats } from '../lib/youtube';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface ChannelAnalyticsProps {
  channel: ChannelStats;
  videos: VideoStats[];
}

export default function ChannelAnalytics({ channel, videos }: ChannelAnalyticsProps) {
  const [chartData, setChartData] = useState({
    videoStats: {
      labels: [] as string[],
      views: [] as number[],
      likes: [] as number[],
      comments: [] as number[],
    },
    donutData: {
      labels: ['Videos', 'Subscribers', 'Views'],
      data: [0, 0, 0],
    },
  });

  useEffect(() => {
    // Process video data for charts
    const processVideoData = () => {
      // Sort videos by view count
      const sortedVideos = [...videos].sort((a, b) => b.viewCount - a.viewCount).slice(0, 5);
      
      const labels = sortedVideos.map(video => {
        // Truncate long titles
        return video.title.length > 30 ? video.title.substring(0, 27) + '...' : video.title;
      });
      
      const views = sortedVideos.map(video => video.viewCount);
      const likes = sortedVideos.map(video => video.likeCount);
      const comments = sortedVideos.map(video => video.commentCount);
      
      // For the donut chart
      const donutData = {
        labels: ['Videos', 'Subscribers', 'Views'],
        data: [channel.videoCount, channel.subscriberCount, channel.viewCount],
      };
      
      setChartData({
        videoStats: {
          labels,
          views,
          likes,
          comments,
        },
        donutData,
      });
    };
    
    processVideoData();
  }, [videos, channel]);

  // Create the options for each chart
  const viewsOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Top 5 Videos by Views',
      },
    },
  };

  const engagementOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Likes & Comments for Top Videos',
      },
    },
  };

  // Create the datasets
  const viewsData = {
    labels: chartData.videoStats.labels,
    datasets: [
      {
        label: 'Views',
        data: chartData.videoStats.views,
        backgroundColor: 'rgba(255, 0, 0, 0.7)', // YouTube red
      },
    ],
  };

  const engagementData = {
    labels: chartData.videoStats.labels,
    datasets: [
      {
        label: 'Likes',
        data: chartData.videoStats.likes,
        backgroundColor: 'rgba(54, 162, 235, 0.7)', // Blue
      },
      {
        label: 'Comments',
        data: chartData.videoStats.comments,
        backgroundColor: 'rgba(75, 192, 192, 0.7)', // Green
      },
    ],
  };

  const donutData = {
    labels: chartData.donutData.labels,
    datasets: [
      {
        label: 'Channel Overview',
        data: chartData.donutData.data,
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)', // Blue for videos
          'rgba(75, 192, 192, 0.7)', // Green for subscribers
          'rgba(255, 99, 132, 0.7)', // Pink for views
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const donutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Channel Overview',
      },
    },
  };

  // Calculate engagement rate for top videos
  const calculateEngagementRate = () => {
    if (videos.length === 0) return 0;
    
    const totalViews = videos.reduce((sum, video) => sum + video.viewCount, 0);
    const totalEngagement = videos.reduce((sum, video) => sum + video.likeCount + video.commentCount, 0);
    
    return totalViews > 0 ? (totalEngagement / totalViews) * 100 : 0;
  };

  const engagementRate = calculateEngagementRate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Channel Summary Card */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 lg:col-span-3">
        <h3 className="text-xl font-bold mb-4">Channel Summary</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          <strong>Total Videos:</strong> {channel.videoCount.toLocaleString()}
        </p>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          <strong>Total Subscribers:</strong> {channel.subscriberCount.toLocaleString()}
        </p>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          <strong>Total Views:</strong> {channel.viewCount.toLocaleString()}
        </p>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          <strong>Average Views per Video:</strong> {channel.videoCount > 0 ? Math.round(channel.viewCount / channel.videoCount).toLocaleString() : 0}
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          <strong>Engagement Rate:</strong> {engagementRate.toFixed(2)}%
        </p>
      </div>
      
      {/* Views Chart */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        {chartData.videoStats.labels.length > 0 ? (
          <Bar options={viewsOptions} data={viewsData} />
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500 dark:text-gray-400">No video data available</p>
          </div>
        )}
      </div>
      
      {/* Engagement Chart */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        {chartData.videoStats.labels.length > 0 ? (
          <Bar options={engagementOptions} data={engagementData} />
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500 dark:text-gray-400">No engagement data available</p>
          </div>
        )}
      </div>
      
      {/* Donut Chart */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <Doughnut options={donutOptions} data={donutData} />
      </div>
    </div>
  );
} 