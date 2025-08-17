

import React, { useState, useEffect } from 'react';

const loadingTexts = [
    "Analyzing market data...",
    "Forecasting financial projections...",
    "Structuring your plan...",
    "Assessing competitive landscape...",
    "Finalizing recommendations..."
];

interface PlanGenerationLoaderProps {
    topic: string;
}

const PlanGenerationLoader: React.FC<PlanGenerationLoaderProps> = ({ topic }) => {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);

    useEffect(() => {
        const textInterval = setInterval(() => {
            setCurrentTextIndex(prevIndex => (prevIndex + 1) % loadingTexts.length);
        }, 3500); // Change text every 3.5 seconds

        return () => clearInterval(textInterval);
    }, []);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-4">
             <div className="w-16 h-16 border-4 border-cyan-500/50 border-t-cyan-500 rounded-full animate-spin mb-8"></div>
             <h2 className="text-3xl font-bold mb-4">Crafting Your Business Plan</h2>
             <p className="text-lg text-gray-600 dark:text-gray-300 transition-opacity duration-500 ease-in-out">
                {loadingTexts[currentTextIndex]}
             </p>
        </div>
    );
};

export default PlanGenerationLoader;