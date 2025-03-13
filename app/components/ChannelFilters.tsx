'use client';

import { useState } from 'react';
import { FaFilter, FaChevronDown, FaChevronUp } from 'react-icons/fa';

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

interface ChannelFiltersProps {
  filters: ChannelFilters;
  onFilterChange: (filters: ChannelFilters) => void;
}

export default function ChannelFilters({ filters, onFilterChange }: ChannelFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubscriberMinChange = (value: string) => {
    onFilterChange({
      ...filters,
      subscriberCount: {
        ...filters.subscriberCount,
        min: value === '' ? null : parseInt(value, 10),
      },
    });
  };

  const handleSubscriberMaxChange = (value: string) => {
    onFilterChange({
      ...filters,
      subscriberCount: {
        ...filters.subscriberCount,
        max: value === '' ? null : parseInt(value, 10),
      },
    });
  };

  const handleVideoCountMinChange = (value: string) => {
    onFilterChange({
      ...filters,
      videoCount: {
        ...filters.videoCount,
        min: value === '' ? null : parseInt(value, 10),
      },
    });
  };

  const handleVideoCountMaxChange = (value: string) => {
    onFilterChange({
      ...filters,
      videoCount: {
        ...filters.videoCount,
        max: value === '' ? null : parseInt(value, 10),
      },
    });
  };

  const handleSortByChange = (value: 'relevance' | 'viewCount' | 'videoCount' | 'subscriberCount') => {
    onFilterChange({
      ...filters,
      sortBy: value,
    });
  };
  
  const handleResetFilters = () => {
    onFilterChange({
      subscriberCount: { min: null, max: null },
      videoCount: { min: null, max: null },
      sortBy: 'relevance'
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left font-medium"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <FaFilter className="mr-2 text-gray-500 dark:text-gray-400" />
          <span>Filter Channels</span>
        </div>
        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
      </button>

      {isExpanded && (
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="font-medium mb-2">Subscriber Count</h3>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  placeholder="Min"
                  className="input flex-1"
                  value={filters.subscriberCount.min === null ? '' : filters.subscriberCount.min}
                  onChange={(e) => handleSubscriberMinChange(e.target.value)}
                  min="0"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="input flex-1"
                  value={filters.subscriberCount.max === null ? '' : filters.subscriberCount.max}
                  onChange={(e) => handleSubscriberMaxChange(e.target.value)}
                  min="0"
                />
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Video Count</h3>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  placeholder="Min"
                  className="input flex-1"
                  value={filters.videoCount.min === null ? '' : filters.videoCount.min}
                  onChange={(e) => handleVideoCountMinChange(e.target.value)}
                  min="0"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="input flex-1"
                  value={filters.videoCount.max === null ? '' : filters.videoCount.max}
                  onChange={(e) => handleVideoCountMaxChange(e.target.value)}
                  min="0"
                />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-medium mb-2">Sort By</h3>
            <select
              className="input w-full"
              value={filters.sortBy}
              onChange={(e) => handleSortByChange(e.target.value as any)}
            >
              <option value="relevance">Relevance</option>
              <option value="subscriberCount">Subscriber Count (High to Low)</option>
              <option value="viewCount">View Count (High to Low)</option>
              <option value="videoCount">Video Count (High to Low)</option>
            </select>
          </div>

          <div className="flex justify-end">
            <button
              className="btn text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 mr-2"
              onClick={handleResetFilters}
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 