'use client';

import { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { VideoStats } from '../../lib/youtube';

interface VideoPerformanceChartProps {
  channelId: string;
  maxVideos?: number;
}

interface PerformanceDataPoint {
  title: string;
  views: number;
  likes: number;
  comments: number;
  engagement: number;
}

export default function VideoPerformanceChart({ 
  channelId, 
  maxVideos = 5 
}: VideoPerformanceChartProps) {
  const [data, setData] = useState<PerformanceDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchVideoData = async () => {
      setLoading(true);
      
      try {
        // Fetch videos from the channel
        const response = await fetch(`/api/youtube?action=getChannelVideos&channelId=${channelId}&maxResults=20`);
        const videos: VideoStats[] = await response.json();
        
        // Calculate engagement rate and prepare data for the chart
        const performanceData = videos.slice(0, maxVideos).map(video => {
          // Engagement rate = (likes + comments) / views * 100
          const engagement = ((video.likeCount + video.commentCount) / video.viewCount) * 100;
          
          return {
            title: video.title.length > 20 ? video.title.substring(0, 20) + '...' : video.title,
            views: video.viewCount,
            likes: video.likeCount,
            comments: video.commentCount,
            engagement: parseFloat(engagement.toFixed(2)),
            fullTitle: video.title // For tooltip
          };
        });
        
        // Sort by views
        performanceData.sort((a, b) => b.views - a.views);
        
        setData(performanceData);
      } catch (error) {
        console.error('Error fetching video performance data:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVideoData();
  }, [channelId, maxVideos]);
  
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm h-80 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
          <div className="h-40 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm h-80 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">No video performance data available</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">Top Videos Performance</h3>
      
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
            <XAxis 
              type="number"
              stroke="#6B7280"
              tick={{ fill: '#6B7280' }}
              tickFormatter={(value) => {
                if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                return value;
              }}
            />
            <YAxis 
              dataKey="title"
              type="category"
              stroke="#6B7280"
              tick={{ fill: '#6B7280' }}
              width={150}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(17, 24, 39, 0.8)', 
                borderColor: '#374151',
                borderRadius: '0.5rem',
                color: '#F3F4F6' 
              }}
              formatter={(value: number, name: string) => {
                if (name === 'engagement') return [`${value.toFixed(2)}%`, 'Engagement Rate'];
                if (value >= 1000000) return [`${(value / 1000000).toFixed(1)}M`, name.charAt(0).toUpperCase() + name.slice(1)];
                if (value >= 1000) return [`${(value / 1000).toFixed(0)}K`, name.charAt(0).toUpperCase() + name.slice(1)];
                return [value, name.charAt(0).toUpperCase() + name.slice(1)];
              }}
              labelFormatter={(value, entry) => {
                const dataPoint = entry[0]?.payload;
                return dataPoint?.fullTitle || value;
              }}
              labelStyle={{ color: '#F3F4F6' }}
            />
            <Legend wrapperStyle={{ color: '#6B7280' }} />
            <Bar dataKey="views" name="Views" fill="#3B82F6" radius={[0, 4, 4, 0]} />
            <Bar dataKey="likes" name="Likes" fill="#10B981" radius={[0, 4, 4, 0]} />
            <Bar dataKey="comments" name="Comments" fill="#F59E0B" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 