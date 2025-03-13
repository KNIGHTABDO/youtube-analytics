import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await request.json();
    
    if (!accessToken) {
      return NextResponse.json({ error: 'Access token is required' }, { status: 400 });
    }
    
    // Call YouTube API with the access token
    const response = await fetch(
      'https://www.googleapis.com/youtube/v3/channels?part=id,snippet,statistics,contentDetails&mine=true',
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      }
    );
    
    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      return NextResponse.json({ error: 'No channel found' }, { status: 404 });
    }
    
    const channel = data.items[0];
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
    console.error('Error fetching authenticated channel:', error);
    return NextResponse.json({ error: 'Failed to fetch authenticated channel' }, { status: 500 });
  }
} 