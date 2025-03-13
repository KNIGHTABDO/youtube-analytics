'use client';

import { useTheme } from '../contexts/ThemeContext';
import { FaMoon, FaSun } from 'react-icons/fa';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <FaMoon className="text-gray-700" size={18} />
      ) : (
        <FaSun className="text-yellow-300" size={18} />
      )}
    </button>
  );
} 