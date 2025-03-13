'use client';

import { useState, useRef, useEffect } from 'react';
import { FaRobot, FaUser, FaPaperPlane, FaLightbulb, FaTimes, FaSyncAlt } from 'react-icons/fa';
import { useChannelStore } from '../lib/store';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const creativePrompts = [
  "How can I make my thumbnails more clickable?",
  "Suggest content ideas based on my channel's performance",
  "How to increase audience engagement in my videos?",
  "What video length works best for my type of content?",
  "Tips for improving my video titles and descriptions",
  "How can I develop a unique content style?",
  "Ways to repurpose my existing YouTube content",
  "Trending topics I should cover in my niche"
];

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: "👋 Hi there! I'm your Creative Coach, powered by AI. I can help you enhance your YouTube content strategy, provide creative ideas, and suggest improvements based on your channel's performance. What would you like help with today?" 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { selectedChannel, channelVideos } = useChannelStore();

  // Auto-scroll to the bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent, promptOverride?: string) => {
    e.preventDefault();
    const userMessage = promptOverride || input;
    
    if (!userMessage.trim()) return;
    
    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: userMessage,
          channelData: selectedChannel,
          videoStats: channelVideos
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `Sorry, I encountered an error: ${data.error || 'Unknown error'}. Please try again.` 
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Sorry, I couldn't process your request. Please check your connection and try again." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptClick = (prompt: string) => {
    handleSubmit(new Event('submit') as any, prompt);
  };
  
  const clearConversation = () => {
    setMessages([{ 
      role: 'assistant', 
      content: "Conversation cleared! How else can I help you with your YouTube content today?" 
    }]);
  };

  return (
    <>
      {/* Floating button to open assistant */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-primary hover:bg-red-700 text-white rounded-full p-4 shadow-lg transition-transform transform hover:scale-110 flex items-center gap-2 z-40"
          aria-label="Open AI Creative Coach"
        >
          <FaLightbulb className="text-xl" />
          <span className="font-medium">Creative Coach</span>
        </button>
      )}
      
      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-0 right-0 md:bottom-6 md:right-6 w-full md:w-96 bg-white dark:bg-gray-800 rounded-t-lg md:rounded-lg shadow-xl z-50 flex flex-col max-h-[600px] border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 rounded-full p-2">
                <FaRobot className="text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 dark:text-gray-200">Creative Coach</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">AI-powered content advisor</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={clearConversation}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label="Clear conversation"
              >
                <FaSyncAlt />
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label="Close assistant"
              >
                <FaTimes />
              </button>
            </div>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, i) => (
              <div 
                key={i} 
                className={`flex gap-3 ${message.role === 'assistant' ? 'items-start' : 'items-start justify-end'}`}
              >
                {message.role === 'assistant' && (
                  <div className="bg-primary/10 rounded-full p-2 h-8 w-8 flex items-center justify-center flex-shrink-0">
                    <FaRobot className="text-primary text-sm" />
                  </div>
                )}
                
                <div 
                  className={`rounded-lg p-3 max-w-[80%] ${
                    message.role === 'assistant' 
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200' 
                      : 'bg-primary text-white'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                
                {message.role === 'user' && (
                  <div className="bg-gray-200 dark:bg-gray-600 rounded-full p-2 h-8 w-8 flex items-center justify-center flex-shrink-0">
                    <FaUser className="text-gray-600 dark:text-gray-300 text-sm" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 items-start">
                <div className="bg-primary/10 rounded-full p-2 h-8 w-8 flex items-center justify-center flex-shrink-0">
                  <FaRobot className="text-primary text-sm" />
                </div>
                <div className="rounded-lg p-3 bg-gray-100 dark:bg-gray-700 max-w-[80%]">
                  <div className="flex space-x-2">
                    <div className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Suggestion chips */}
          {messages.length <= 2 && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 overflow-x-auto">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Try asking about:</p>
              <div className="flex gap-2 flex-nowrap pb-1">
                {creativePrompts.slice(0, 4).map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handlePromptClick(prompt)}
                    className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full px-3 py-1 whitespace-nowrap text-gray-800 dark:text-gray-200 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Input area */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask for creative ideas..."
                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-gray-200"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-primary hover:bg-red-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg p-2 transition-colors"
                aria-label="Send message"
              >
                <FaPaperPlane />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
} 