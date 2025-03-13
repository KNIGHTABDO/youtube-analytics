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

// Search for channels
export async function searchChannels(query: string): Promise<ChannelStats[]> {
  try {
    const response = await fetch(`/api/youtube?action=searchChannels&query=${encodeURIComponent(query)}`);
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