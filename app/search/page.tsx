'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import { searchChannels } from '../lib/youtube';
import { useChannelStore } from '../lib/store';
import ChannelCard from '../components/ChannelCard';
import ChannelFilters, { ChannelFilters as ChannelFiltersType } from '../components/ChannelFilters';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const { searchResults, isLoading, setSearchResults, setIsLoading, setError } = useChannelStore();
  const [filters, setFilters] = useState<ChannelFiltersType>({
    subscriberCount: { min: null, max: null },
    videoCount: { min: null, max: null },
    sortBy: 'relevance'
  });
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const results = await searchChannels(query, filters);
      setSearchResults(results);
      
      if (results.length === 0) {
        setError('No channels found. Try different search terms or filters.');
      }
    } catch (error) {
      console.error('Error searching channels:', error);
      setError('Failed to search channels. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters: ChannelFiltersType) => {
    setFilters(newFilters);
    
    // Count active filters
    let count = 0;
    if (newFilters.subscriberCount.min !== null) count++;
    if (newFilters.subscriberCount.max !== null) count++;
    if (newFilters.videoCount.min !== null) count++;
    if (newFilters.videoCount.max !== null) count++;
    if (newFilters.sortBy !== 'relevance') count++;
    
    setActiveFiltersCount(count);
  };

  const handleChannelSelect = (channelId: string) => {
    router.push(`/channel/${channelId}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Search YouTube Channels</h1>
      
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a YouTube channel..."
              className="input pl-10"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary px-6 py-2 rounded-md relative"
          >
            {isLoading ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : (
              <>
                Search
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </>
            )}
          </button>
        </div>
      </form>
      
      <ChannelFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
      />
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <FaSpinner className="animate-spin text-primary text-4xl" />
        </div>
      ) : (
        <>
          {searchResults.length > 0 && (
            <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              Showing {searchResults.length} results
            </div>
          )}
          <div className="grid gap-6">
            {searchResults.map((channel) => (
              <ChannelCard
                key={channel.id}
                channel={channel}
                onClick={() => handleChannelSelect(channel.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
} 