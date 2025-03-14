import { NextResponse } from 'next/server';
import { google } from 'googleapis';

// Initialize YouTube API client
const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const channelId = searchParams.get('channelId');
  
  if (action === 'getChannelStats' && channelId) {
    try {
      const response = await youtube.channels.list({
        part: ['snippet', 'statistics', 'contentDetails'],
        id: [channelId],
      });
      
      if (!response.data.items || response.data.items.length === 0) {
        return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
      }
      
      const channel = response.data.items[0];
      const snippet = channel.snippet || {};
      const statistics = channel.statistics || {};
      
      return NextResponse.json({
        id: channel.id || '',
        title: snippet.title || '',
        description: snippet.description || '',
        customUrl: snippet.customUrl || '',
        publishedAt: snippet.publishedAt || '',
        thumbnails: {
          default: snippet.thumbnails?.default?.url || '',
          medium: snippet.thumbnails?.medium?.url || '',
          high: snippet.thumbnails?.high?.url || '',
        },
        subscriberCount: parseInt(statistics.subscriberCount || '0', 10),
        videoCount: parseInt(statistics.videoCount || '0', 10),
        viewCount: parseInt(statistics.viewCount || '0', 10),
      });
    } catch (error) {
      console.error('Error fetching channel stats:', error);
      return NextResponse.json({ error: 'Failed to fetch channel data' }, { status: 500 });
    }
  }
  
  if (action === 'getChannelVideos' && channelId) {
    try {
      const maxResults = searchParams.get('maxResults') || '10';
      
      const response = await youtube.search.list({
        part: ['snippet'],
        channelId,
        order: 'viewCount',
        type: ['video'],
        maxResults: parseInt(maxResults, 10),
      });
      
      if (!response.data.items || response.data.items.length === 0) {
        return NextResponse.json([], { status: 200 });
      }
      
      const videoIds = response.data.items.map((item) => item.id?.videoId || '').filter(Boolean);
      
      const videoDetails = await youtube.videos.list({
        part: ['snippet', 'statistics', 'contentDetails'],
        id: videoIds,
      });
      
      if (!videoDetails.data.items) {
        return NextResponse.json([], { status: 200 });
      }
      
      const videos = videoDetails.data.items.map((video) => {
        const snippet = video.snippet || {};
        const statistics = video.statistics || {};
        const contentDetails = video.contentDetails || {};
        
        return {
          id: video.id || '',
          title: snippet.title || '',
          description: snippet.description || '',
          publishedAt: snippet.publishedAt || '',
          thumbnails: {
            default: snippet.thumbnails?.default?.url || '',
            medium: snippet.thumbnails?.medium?.url || '',
            high: snippet.thumbnails?.high?.url || '',
          },
          viewCount: parseInt(statistics.viewCount || '0', 10),
          likeCount: parseInt(statistics.likeCount || '0', 10),
          commentCount: parseInt(statistics.commentCount || '0', 10),
          duration: contentDetails.duration || '',
        };
      });
      
      return NextResponse.json(videos);
    } catch (error) {
      console.error('Error fetching channel videos:', error);
      return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
    }
  }
  
  if (action === 'searchChannels') {
    try {
      const query = searchParams.get('query');
      if (!query) {
        return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
      }
      
      // Get filter parameters
      const subscriberMin = searchParams.get('subscriberMin');
      const subscriberMax = searchParams.get('subscriberMax');
      const videoMin = searchParams.get('videoMin');
      const videoMax = searchParams.get('videoMax');
      const sortBy = searchParams.get('sortBy') || 'relevance';
      
      const response = await youtube.search.list({
        part: ['snippet'],
        q: query,
        type: ['channel'],
        maxResults: 50, // Get more results for filtering
        order: sortBy === 'relevance' ? 'relevance' : undefined,
      });
      
      if (!response.data.items || response.data.items.length === 0) {
        return NextResponse.json([], { status: 200 });
      }
      
      // Get detailed info for each channel
      const channelIds = response.data.items.map((item) => item.id?.channelId || '').filter(Boolean);
      const channelDetails = await youtube.channels.list({
        part: ['snippet', 'statistics', 'contentDetails'],
        id: channelIds,
      });
      
      if (!channelDetails.data.items) {
        return NextResponse.json([], { status: 200 });
      }
      
      let channels = channelDetails.data.items.map((channel) => {
        const snippet = channel.snippet || {};
        const statistics = channel.statistics || {};
        
        return {
          id: channel.id || '',
          title: snippet.title || '',
          description: snippet.description || '',
          customUrl: snippet.customUrl || '',
          publishedAt: snippet.publishedAt || '',
          thumbnails: {
            default: snippet.thumbnails?.default?.url || '',
            medium: snippet.thumbnails?.medium?.url || '',
            high: snippet.thumbnails?.high?.url || '',
          },
          subscriberCount: parseInt(statistics.subscriberCount || '0', 10),
          videoCount: parseInt(statistics.videoCount || '0', 10),
          viewCount: parseInt(statistics.viewCount || '0', 10),
        };
      });
      
      // Apply filters
      if (subscriberMin || subscriberMax || videoMin || videoMax) {
        channels = channels.filter((channel) => {
          const passesSubscriberMin = !subscriberMin || channel.subscriberCount >= parseInt(subscriberMin, 10);
          const passesSubscriberMax = !subscriberMax || channel.subscriberCount <= parseInt(subscriberMax, 10);
          const passesVideoMin = !videoMin || channel.videoCount >= parseInt(videoMin, 10);
          const passesVideoMax = !videoMax || channel.videoCount <= parseInt(videoMax, 10);
          
          return passesSubscriberMin && passesSubscriberMax && passesVideoMin && passesVideoMax;
        });
      }
      
      // Apply sorting (if not relevance, which is handled by the API)
      if (sortBy !== 'relevance') {
        channels.sort((a, b) => {
          if (sortBy === 'subscriberCount') {
            return b.subscriberCount - a.subscriberCount;
          } else if (sortBy === 'videoCount') {
            return b.videoCount - a.videoCount;
          } else if (sortBy === 'viewCount') {
            return b.viewCount - a.viewCount;
          }
          return 0;
        });
      }
      
      // Limit to 10 results after filtering
      channels = channels.slice(0, 10);
      
      return NextResponse.json(channels);
    } catch (error) {
      console.error('Error searching channels:', error);
      return NextResponse.json({ error: 'Failed to search channels' }, { status: 500 });
    }
  }
  
  // If no valid action is specified
  return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
} 