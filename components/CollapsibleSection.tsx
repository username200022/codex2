
import React, { useState } from 'react';

const ChevronIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`w-6 h-6 transform transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180' : 'rotate-0'}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
    >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);


interface CollapsibleSectionProps {
    title: string;
    children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg border border-gray-200/80 dark:border-gray-700/80 overflow-hidden transition-all duration-300">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 text-left font-semibold text-gray-800 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-gray-700/40 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-inset"
                aria-expanded={isOpen}
                aria-controls={`section-content-${title.replace(/\s+/g, '-')}`}
            >
                <span className="text-lg">{title}</span>
                <ChevronIcon isOpen={isOpen} />
            </button>
            <div
                id={`section-content-${title.replace(/\s+/g, '-')}`}
                className={`transition-all duration-500 ease-in-out grid ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
                <div className="overflow-hidden">
                     <div className="p-4 border-t border-gray-200/80 dark:border-gray-700/80">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollapsibleSection;
