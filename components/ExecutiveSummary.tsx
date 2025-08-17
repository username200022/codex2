import React from 'react';
import { marked } from 'marked';
import { highlightKeywords } from '../utils/text-enhancers';

interface ExecutiveSummaryProps {
    summary: string;
}

const InfoIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
);

const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ summary }) => {
    if (!summary) return null;

    const contentHtml = marked.parse(highlightKeywords(summary)) as string;

    return (
        <div className="my-8 bg-gray-100 dark:bg-gray-800/50 border-l-4 border-cyan-500 p-6 rounded-r-lg">
            <div className="flex items-start gap-4">
                <InfoIcon className="w-8 h-8 text-cyan-500 dark:text-cyan-400 flex-shrink-0 mt-1" />
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Executive Summary</h2>
                    <div
                        className="prose prose-p:my-2 dark:prose-invert max-w-none text-gray-600 dark:text-gray-300"
                        dangerouslySetInnerHTML={{ __html: contentHtml }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ExecutiveSummary;
