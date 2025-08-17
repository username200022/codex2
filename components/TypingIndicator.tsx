
import React, { useState, useEffect } from 'react';

const AssistantIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
       <path d="M12 2C9.25 2 7 4.25 7 7c0 .91.24 1.76.66 2.52-.75.6-1.35 1.4-1.63 2.33-.24.78-.33 1.62-.27 2.47.1.92.53 1.79 1.15 2.5.49.56 1.09 1.02 1.77 1.36.1.75.31 1.47.63 2.14.28.6.64 1.15 1.07 1.63.21.24.5.37.8.37s.59-.13.8-.37c.43-.48.79-1.03 1.07-1.63.32-.67.53-1.39.63-2.14.68-.34 1.28-.79 1.77-1.36.62-.71 1.05-1.58 1.15-2.5.06-.85-.03-1.69-.27-2.47-.28-.93-.88-1.73-1.63-2.33.42-.76.66-1.61.66-2.52C17 4.25 14.75 2 12 2z"/>
    </svg>
);

interface TypingIndicatorProps {
    wittyMessages?: string[];
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ wittyMessages }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!wittyMessages || wittyMessages.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % wittyMessages.length);
        }, 3000); // Change message every 3 seconds

        return () => clearInterval(interval);
    }, [wittyMessages]);

    const hasWittyMessages = wittyMessages && wittyMessages.length > 0;

    return (
        <div className="flex items-start gap-3 w-full max-w-4xl mx-auto">
            <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-cyan-500">
                <AssistantIcon className="w-6 h-6 text-white"/>
            </div>
            <div className="p-4 rounded-2xl rounded-bl-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                <div className="flex items-center space-x-2">
                    {hasWittyMessages ? (
                        <div className="text-gray-600 dark:text-gray-300 italic transition-opacity duration-500">
                            {wittyMessages[currentIndex]}
                        </div>
                    ) : null}
                    <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};

export default TypingIndicator;
