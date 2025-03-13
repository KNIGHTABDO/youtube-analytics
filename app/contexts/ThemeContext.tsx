'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  
  useEffect(() => {
    // Check if there is a theme preference in localStorage
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    
    // Check system preference if no stored preference
    if (!storedTheme) {
      const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'dark' 
        : 'light';
      setTheme(systemPreference);
      localStorage.setItem('theme', systemPreference);
    } else {
      setTheme(storedTheme);
    }
    
    // Apply theme to document
    document.documentElement.classList.toggle('dark', storedTheme === 'dark');
  }, []);
  
  // Update theme in localStorage and document classes when theme changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 