import Link from 'next/link';
import { FaYoutube, FaChartLine, FaSearch, FaUserAlt } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="flex flex-col space-y-12">
      {/* Hero Section */}
      <section className="py-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              <span className="text-primary">YouTube</span> Analytics Dashboard
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Analyze channel performance, track growth, and get insights to optimize your YouTube strategy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/search" 
                className="btn btn-primary px-6 py-3 rounded-md"
              >
                Start Analyzing Now
              </Link>
              <Link 
                href="/dashboard" 
                className="btn btn-outline px-6 py-3 rounded-md border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
          
          <div className="relative h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
            <FaYoutube className="w-32 h-32 text-primary animate-pulse" />
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Powerful Analytics Features</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="h-12 w-12 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center mb-6">
              <FaSearch className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Channel Search</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Search for any YouTube channel and get comprehensive analytics and insights.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="h-12 w-12 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center mb-6">
              <FaChartLine className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Detailed Metrics</h3>
            <p className="text-gray-600 dark:text-gray-400">
              View subscriber growth, video performance, and audience engagement metrics.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="h-12 w-12 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center mb-6">
              <FaUserAlt className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Personal Dashboard</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Connect your own YouTube account to access personal analytics and insights.
            </p>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-primary to-red-700 rounded-2xl text-white">
        <div className="text-center p-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Analyze Your YouTube Channel?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Sign in with your Google account to access detailed analytics for your YouTube channel.
          </p>
          <Link 
            href="/search" 
            className="btn px-8 py-3 bg-white text-primary hover:bg-gray-100 rounded-md font-medium"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
} 