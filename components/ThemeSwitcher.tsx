
import React from 'react';
import { useTheme } from '../hooks/useTheme';

const SunIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.64 5.64c.39.39 1.02.39 1.41 0s.39-1.02 0-1.41L5.64 2.81c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l1.41 1.42zM18.36 16.95c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41l-1.41-1.42c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l1.41 1.42zM16.95 5.64l1.41-1.42c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0l-1.41 1.42c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0zM4.22 16.95l1.41 1.42c.39.39 1.02.39 1.41 0s.39-1.02 0-1.41l-1.41-1.42c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41z"/>
  </svg>
);

const MoonIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 2c-1.82 0-3.53.5-5 1.35 2.99 1.73 5 4.95 5 8.65s-2.01 6.92-5 8.65C6.47 21.5 8.18 22 10 22c5.52 0 10-4.48 10-10S15.52 2 10 2z"/>
  </svg>
);

const SystemIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h3l-1 1v2h12v-2l-1-1h3c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 13H4V5h16v11z"/>
    </svg>
);

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const options = [
    { name: 'light', icon: SunIcon },
    { name: 'dark', icon: MoonIcon },
    { name: 'system', icon: SystemIcon },
  ];

  return (
    <div className="flex items-center p-1 rounded-full bg-gray-200/80 dark:bg-gray-700/80">
      {options.map(option => {
        const isActive = theme === option.name;
        const Icon = option.icon;
        return (
          <button
            key={option.name}
            onClick={() => setTheme(option.name as 'light' | 'dark' | 'system')}
            className={`p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
              isActive ? 'bg-white shadow dark:bg-gray-900' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'
            }`}
            aria-label={`Switch to ${option.name} theme`}
          >
            <Icon className="w-5 h-5" />
          </button>
        );
      })}
    </div>
  );
};

export default ThemeSwitcher;
