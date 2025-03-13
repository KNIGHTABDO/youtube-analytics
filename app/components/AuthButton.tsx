'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { FaGoogle } from 'react-icons/fa';

export default function AuthButton() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const fetchUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          scopes: 'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/yt-analytics.readonly',
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <button 
        className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-400"
        disabled
      >
        Loading...
      </button>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {user.email}
        </span>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 rounded-md bg-secondary text-white hover:bg-gray-700 transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleSignIn}
      className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-white hover:bg-red-700 transition-colors"
    >
      <FaGoogle />
      <span>Sign in with Google</span>
    </button>
  );
} 