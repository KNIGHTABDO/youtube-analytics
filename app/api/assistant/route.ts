import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

// Initialize OpenAI client with OpenRouter endpoint
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || 'DEMO', // Default to 'DEMO' for tests
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'https://youtubeanalytics.com', // Replace with your actual site URL in production
    'X-Title': 'YouTube Analytics Assistant',
  },
});

export async function POST(req: Request) {
  try {
    const { prompt, channelData, videoStats } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Construct a richer prompt with channel and video data when available
    let enrichedPrompt = prompt;
    
    if (channelData) {
      enrichedPrompt += `\n\nChannel Information:\nName: ${channelData.title}\nSubscribers: ${channelData.subscriberCount}\nTotal Views: ${channelData.viewCount}\nVideos: ${channelData.videoCount}`;
    }
    
    if (videoStats && videoStats.length > 0) {
      enrichedPrompt += `\n\nTop Performing Videos:\n`;
      videoStats.slice(0, 3).forEach((video: any, index: number) => {
        enrichedPrompt += `${index + 1}. ${video.title} - ${video.viewCount} views, ${video.likeCount} likes\n`;
      });
    }

    // Add a system message to guide the AI's role
    const systemMessage = `You are CreativeCoach, a specialized AI assistant for YouTube content creators. 
    Your purpose is to help creators enhance their creativity, develop better content strategies, and 
    improve their channel performance. Provide specific, actionable advice based on their channel data 
    and questions. Be encouraging, insightful, and focused on helping them grow their audience and 
    creative abilities. Always maintain a supportive and professional tone.`;

    // Call OpenRouter using the OpenAI-compatible API
    const completion = await openai.chat.completions.create({
      model: 'google/gemini-pro',  // Using Gemini Pro through OpenRouter
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: enrichedPrompt }
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    return NextResponse.json({ response: completion.choices[0].message.content });
  } catch (error: any) {
    console.error('AI Assistant API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate response' },
      { status: 500 }
    );
  }
} 