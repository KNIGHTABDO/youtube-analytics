import { create } from 'zustand';
import { ChannelStats, VideoStats } from './youtube';

interface ChannelState {
  selectedChannel: ChannelStats | null;
  channelVideos: VideoStats[];
  searchResults: ChannelStats[];
  isLoading: boolean;
  error: string | null;
  setSelectedChannel: (channel: ChannelStats | null) => void;
  setChannelVideos: (videos: VideoStats[]) => void;
  setSearchResults: (channels: ChannelStats[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useChannelStore = create<ChannelState>((set) => ({
  selectedChannel: null,
  channelVideos: [],
  searchResults: [],
  isLoading: false,
  error: null,

  setSelectedChannel: (channel) => set({ selectedChannel: channel }),
  setChannelVideos: (videos) => set({ channelVideos: videos }),
  setSearchResults: (channels) => set({ searchResults: channels }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set({
    selectedChannel: null,
    channelVideos: [],
    searchResults: [],
    isLoading: false,
    error: null,
  }),
})); 