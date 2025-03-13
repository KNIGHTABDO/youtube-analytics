# YouTube Analytics

A modern web application that allows users to search for YouTube channels, view detailed analytics, and connect their own YouTube account to see personal analytics.

![YouTube Analytics Dashboard](https://i.ibb.co/w4NHkQ6/youtube-analytics.jpg)

## Features

- **Channel Search**: Search for any YouTube channel and get detailed analytics
- **Channel Analytics**: View subscriber count, video count, total views, and engagement metrics
- **Video Stats**: See the most popular videos from a channel with detailed stats
- **Personal Dashboard**: Connect your own YouTube account to view your channel's analytics
- **Authentication**: Sign in with Google/YouTube using Supabase authentication
- **Responsive Design**: Works beautifully on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth (with Google OAuth)
- **Data Visualization**: Chart.js & react-chartjs-2
- **API Integration**: YouTube Data API v3
- **State Management**: Zustand
- **Icons**: React Icons

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- A YouTube API key
- A Supabase account and project

### Environment Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/youtube-analytics.git
   cd youtube-analytics
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   YOUTUBE_API_KEY=your_youtube_api_key
   ```

### Setting up YouTube API

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the YouTube Data API v3
4. Create API credentials (API Key)
5. Add the API Key to your `.env.local` file

### Setting up Supabase

1. Create a new project on [Supabase](https://supabase.com/)
2. Go to Authentication → Providers and enable Google OAuth
3. Set up your Google OAuth credentials in the [Google Cloud Console](https://console.cloud.google.com/)
4. Add your Supabase URL and anon key to the `.env.local` file

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

This project can be easily deployed to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fyoutube-analytics)

Make sure to add the environment variables in your Vercel project settings.

## Project Structure

```
├── app/                   # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication routes
│   ├── channel/           # Channel details page
│   ├── components/        # React components
│   ├── dashboard/         # User dashboard page
│   ├── lib/               # Utility functions and API clients
│   ├── search/            # Channel search page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── public/                # Static assets
├── .env.local             # Environment variables (create this)
├── next.config.js         # Next.js configuration
├── package.json           # Dependencies and scripts
├── postcss.config.js      # PostCSS configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [YouTube Data API](https://developers.google.com/youtube/v3)
- [Supabase](https://supabase.com/) for authentication
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Chart.js](https://www.chartjs.org/) for data visualization
- [Next.js](https://nextjs.org/) for the framework
