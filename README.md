# YouTube Analytics Platform

![YouTube Analytics](https://i.imgur.com/JZT06jN.png)

A powerful, feature-rich analytics platform for YouTube content creators to track performance, optimize content strategy, and grow their channel with AI-powered recommendations.

## ✨ Features

- **Comprehensive Dashboard**: View key metrics and channel performance at a glance
- **Video Analytics**: Detailed performance metrics for all your videos
- **Visual Data Insights**: Beautiful charts and visualizations of your channel growth
- **Dark Mode Support**: Comfortable viewing experience in any lighting condition
- **Video Detail Access**: Click on videos to see in-depth analytics and insights
- **AI Creative Coach**: Get personalized content recommendations and creative strategies powered by Gemini AI
- **Data Export**: Export your analytics data for further analysis
- **Channel Comparison**: Search and compare other public YouTube channels

## 🧠 AI Creative Coach

Our platform includes an AI-powered Creative Coach that helps you:

- Generate content ideas based on your channel's performance
- Optimize titles, descriptions, and thumbnails for better engagement
- Develop a unique content style that resonates with your audience
- Identify trends and opportunities in your niche
- Create better storytelling strategies for increased viewer retention

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- A Google account with YouTube API access
- Supabase account (for authentication)

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/youtube-analytics.git
cd youtube-analytics
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables
   Create a `.env.local` file in the root directory with the following variables:

```
# Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# YouTube API key (server-side only)
YOUTUBE_API_KEY=your_youtube_api_key

# OpenRouter API key (server-side only, can use 'DEMO' for testing)
OPENROUTER_API_KEY=your_openrouter_key_or_DEMO
```

4. Run the development server

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Authentication**: Supabase Auth with Google OAuth
- **Data Visualization**: Recharts
- **AI Integration**: OpenRouter API (Google Gemini)
- **API**: YouTube Data API v3

## 📊 Features in Detail

### Dashboard

View comprehensive analytics including:

- Subscriber count and growth
- Total view count and trends
- Engagement metrics (likes, comments)
- Top performing videos

### Video Analytics

For each video, analyze:

- View count and watch time
- Audience retention
- Engagement rates
- Performance trends

### AI Creative Coach

Get AI-powered advice on:

- Content strategy optimization
- Audience growth tactics
- SEO and discoverability improvements
- Creative development and storytelling techniques

## 🔧 Configuration

### Google API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the YouTube Data API v3
4. Create API credentials (API Key and OAuth 2.0 Client ID)
5. Configure the OAuth consent screen with the following scopes:
   - `https://www.googleapis.com/auth/youtube.readonly`

### Supabase Setup

1. Create a new project on [Supabase](https://supabase.com/)
2. Set up Google Auth provider in Authentication settings
3. Copy the URL and anon key to your environment variables

### OpenRouter Setup

1. Create an account on [OpenRouter](https://openrouter.ai/)
2. Generate an API key
3. Add it to your environment variables (or use 'DEMO' for testing)

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📬 Contact

Project Link: [https://github.com/KNIGHTABDO/youtube-analytics](https://github.com/KNIGHTABDO/youtube-analytics)

---

Made with ❤️ for YouTube content creators
