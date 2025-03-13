'use client';

import { useEffect, useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { ChannelStats } from '../../lib/youtube';

interface ChannelGrowthChartProps {
  channelId: string;
}

interface GrowthDataPoint {
  date: string;
  subscribers: number;
  views: number;
}

export default function ChannelGrowthChart({ channelId }: ChannelGrowthChartProps) {
  const [data, setData] = useState<GrowthDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, this would fetch historical data from an API
    // For demo purposes, we'll generate mock data based on the channel stats
    
    const generateMockData = async () => {
      setLoading(true);
      
      try {
        // Fetch current channel stats
        const response = await fetch(`/api/youtube?action=getChannelStats&channelId=${channelId}`);
        const channelStats: ChannelStats = await response.json();
        
        // Generate 6 months of mock data
        const mockData: GrowthDataPoint[] = [];
        const currentDate = new Date();
        const currentSubscribers = channelStats.subscriberCount;
        const currentViews = channelStats.viewCount;
        
        // Calculate random growth rates between 0.5% and 5% monthly
        const subscriberGrowthRate = 0.005 + Math.random() * 0.045;
        const viewGrowthRate = 0.01 + Math.random() * 0.09;
        
        for (let i = 6; i >= 0; i--) {
          const date = new Date(currentDate);
          date.setMonth(date.getMonth() - i);
          
          const monthFactor = Math.pow(1 - subscriberGrowthRate, i);
          const viewsFactor = Math.pow(1 - viewGrowthRate, i);
          
          // Add some randomness to make the data look more realistic
          const randomness = 0.98 + Math.random() * 0.04;
          
          mockData.push({
            date: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            subscribers: Math.round(currentSubscribers * monthFactor * randomness),
            views: Math.round(currentViews * viewsFactor * randomness),
          });
        }
        
        setData(mockData);
      } catch (error) {
        console.error('Error generating mock growth data:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    
    generateMockData();
  }, [channelId]);
  
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm h-80 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
          <div className="h-40 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm h-80 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">No growth data available</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">Channel Growth</h3>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
            <XAxis 
              dataKey="date" 
              stroke="#6B7280"
              tick={{ fill: '#6B7280' }}
            />
            <YAxis 
              yAxisId="subscribers"
              orientation="left"
              stroke="#4F46E5"
              tick={{ fill: '#6B7280' }}
              tickFormatter={(value) => {
                if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                return value;
              }}
            />
            <YAxis 
              yAxisId="views"
              orientation="right"
              stroke="#EF4444"
              tick={{ fill: '#6B7280' }}
              tickFormatter={(value) => {
                if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                return value;
              }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(17, 24, 39, 0.8)', 
                borderColor: '#374151',
                borderRadius: '0.5rem',
                color: '#F3F4F6' 
              }}
              formatter={(value: number) => {
                if (value >= 1000000) return [`${(value / 1000000).toFixed(1)}M`, ''];
                if (value >= 1000) return [`${(value / 1000).toFixed(0)}K`, ''];
                return [value, ''];
              }}
              labelStyle={{ color: '#F3F4F6' }}
            />
            <Legend wrapperStyle={{ color: '#6B7280' }} />
            <Line
              yAxisId="subscribers"
              type="monotone"
              dataKey="subscribers"
              name="Subscribers"
              stroke="#4F46E5"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              yAxisId="views"
              type="monotone"
              dataKey="views"
              name="Views"
              stroke="#EF4444"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 