
import React from 'react';
import ThemeSwitcher from './ThemeSwitcher';

const BrainIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C9.25 2 7 4.25 7 7c0 .91.24 1.76.66 2.52-.75.6-1.35 1.4-1.63 2.33-.24.78-.33 1.62-.27 2.47.1.92.53 1.79 1.15 2.5.49.56 1.09 1.02 1.77 1.36.1.75.31 1.47.63 2.14.28.6.64 1.15 1.07 1.63.21.24.5.37.8.37s.59-.13.8-.37c.43-.48.79-1.03 1.07-1.63.32-.67.53-1.39.63-2.14.68-.34 1.28-.79 1.77-1.36.62-.71 1.05-1.58 1.15-2.5.06-.85-.03-1.69-.27-2.47-.28-.93-.88-1.73-1.63-2.33.42-.76.66-1.61.66-2.52C17 4.25 14.75 2 12 2zm-1 14.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5zm2 0c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5zM12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"/>
    </svg>
);

export const Header: React.FC = () => {
    return (
        <header className="flex items-center justify-between w-full p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-10">
            <div className="flex items-center">
                <BrainIcon className="w-8 h-8 mr-3 text-cyan-400" />
                <h1 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                    AI Business Consultant
                </h1>
            </div>
            <ThemeSwitcher />
        </header>
    );
};
