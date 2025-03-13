export interface ChannelStats {
  id: string;
  title: string;
  description: string;
  customUrl: string;
  publishedAt: string;
  thumbnails: {
    default: string;
    medium: string;
    high: string;
  };
  subscriberCount: number;
  videoCount: number;
  viewCount: number;
}

export interface VideoStats {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnails: {
    default: string;
    medium: string;
    high: string;
  };
  viewCount: number;
  likeCount: number;
  commentCount: number;
  duration: string;
}

export interface ChannelFilters {
  subscriberCount: {
    min: number | null;
    max: number | null;
  };
  videoCount: {
    min: number | null;
    max: number | null;
  };
  sortBy: 'relevance' | 'viewCount' | 'videoCount' | 'subscriberCount';
}

// Get channel statistics
export async function getChannelStats(channelId: string): Promise<ChannelStats | null> {
  try {
    const response = await fetch(`/api/youtube?action=getChannelStats&channelId=${channelId}`);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching channel stats:', error);
    return null;
  }
}

// Search for channels with optional filters
export async function searchChannels(
  query: string, 
  filters?: ChannelFilters
): Promise<ChannelStats[]> {
  try {
    let url = `/api/youtube?action=searchChannels&query=${encodeURIComponent(query)}`;
    
    // Add filter parameters if provided
    if (filters) {
      if (filters.subscriberCount.min !== null) {
        url += `&subscriberMin=${filters.subscriberCount.min}`;
      }
      if (filters.subscriberCount.max !== null) {
        url += `&subscriberMax=${filters.subscriberCount.max}`;
      }
      if (filters.videoCount.min !== null) {
        url += `&videoMin=${filters.videoCount.min}`;
      }
      if (filters.videoCount.max !== null) {
        url += `&videoMax=${filters.videoCount.max}`;
      }
      if (filters.sortBy !== 'relevance') {
        url += `&sortBy=${filters.sortBy}`;
      }
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error('Error searching channels:', error);
    return [];
  }
}

// Get channel's most popular videos
export async function getChannelVideos(channelId: string, maxResults = 10): Promise<VideoStats[]> {
  try {
    const response = await fetch(`/api/youtube?action=getChannelVideos&channelId=${channelId}&maxResults=${maxResults}`);
    if (!response.ok) {
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching channel videos:', error);
    return [];
  }
}

// Get authenticated user's channel
export async function getAuthenticatedChannel(accessToken: string): Promise<ChannelStats | null> {
  try {
    const response = await fetch('/api/youtube/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accessToken }),
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching authenticated channel:', error);
    return null;
  }
} 