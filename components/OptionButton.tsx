
import React from 'react';

interface OptionButtonProps {
    text: string;
    onClick: () => void;
    isSelected: boolean;
}

const CheckmarkIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);


const OptionButton: React.FC<OptionButtonProps> = ({ text, onClick, isSelected }) => {
    return (
        <button
            onClick={onClick}
            className={`group w-full flex items-center gap-4 text-left p-3 border rounded-lg transition-all duration-200 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-cyan-500 ${
                isSelected
                    ? 'bg-cyan-600/20 border-cyan-500 scale-[1.02]'
                    : 'bg-gray-100/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
            aria-pressed={isSelected}
            aria-label={`Select option: ${text}`}
        >
            <div className={`w-5 h-5 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${isSelected ? 'border-cyan-400 bg-cyan-400' : 'border-gray-400 dark:border-gray-500 group-hover:border-cyan-400'}`}>
                {isSelected && <CheckmarkIcon className="w-3 h-3 text-gray-900" />}
            </div>
            <span className={`flex-1 ${isSelected ? 'text-cyan-700 dark:text-cyan-100 font-semibold' : 'text-gray-700 dark:text-gray-300'}`}>{text}</span>
        </button>
    );
};

export default OptionButton;
