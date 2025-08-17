import React, { createContext, useState, useEffect, useMemo } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  effectiveTheme: 'light' | 'dark';
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as Theme) || 'system';
    }
    return 'system';
  });

  // State to hold the system preference, initialized once.
  const [systemPrefersDark, setSystemPrefersDark] = useState(() => {
      if (typeof window === 'undefined') return false;
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Effect to listen for changes in the system preference.
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemPrefersDark(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []); // Empty array ensures this effect runs only once to set up the listener.


  const effectiveTheme = useMemo<'light' | 'dark'>(() => {
    return theme === 'system' ? (systemPrefersDark ? 'dark' : 'light') : theme;
  }, [theme, systemPrefersDark]);

  useEffect(() => {
    const root = window.document.documentElement;
    
    root.classList.remove('light', 'dark');
    root.classList.add(effectiveTheme);

    localStorage.setItem('theme', theme);
  }, [theme, effectiveTheme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const value = { theme, setTheme, effectiveTheme };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};