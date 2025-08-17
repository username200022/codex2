
import React, { useEffect, useRef } from 'react';
import { marked } from 'marked';
import { useCountUpAnimation } from '../hooks/useCountUpAnimation';
import { highlightKeywords } from '../utils/text-enhancers';

interface Section {
    title: string;
    content: string;
}

interface NodeDetailPanelProps {
    node: Section | null;
    onClose: () => void;
}

const CloseIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const NodeDetailPanel: React.FC<NodeDetailPanelProps> = ({ node, onClose }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    useCountUpAnimation(contentRef, node); // Hook for animating numbers

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    const contentHtml = node ? marked.parse(highlightKeywords(node.content)) as string : '';
    
    const customBulletSvgLight = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%230891b2'%3e%3cpath fill-rule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clip-rule='evenodd' /%3e%3c/svg%3e")`;
    const customBulletSvgDark = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%2306b6d4'%3e%3cpath fill-rule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clip-rule='evenodd' /%3e%3c/svg%3e")`;
    
    const richProseClasses = `
        prose dark:prose-invert max-w-none 
        prose-p:my-4 prose-p:leading-relaxed
        prose-headings:text-cyan-600 dark:prose-headings:text-cyan-400 prose-headings:mt-8 prose-headings:mb-3 prose-headings:pb-2 prose-headings:border-b prose-headings:border-gray-200 dark:prose-headings:border-gray-600
        prose-ul:[--tw-prose-bullets-image:var(--bullet-light)] dark:prose-ul:[--tw-prose-bullets-image:var(--bullet-dark)] prose-ul:list-image-[var(--tw-prose-bullets-image)] prose-li:my-2 prose-li:pl-2
        prose-blockquote:bg-gray-100 dark:prose-blockquote:bg-gray-700/50 prose-blockquote:border-l-4 prose-blockquote:border-cyan-500 prose-blockquote:p-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
        prose-code:bg-gray-200/70 dark:prose-code:bg-gray-600/70 prose-code:text-amber-600 dark:prose-code:text-amber-300 prose-code:font-mono prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-code:before:content-[''] prose-code:after:content-['']
        prose-code:transition-all prose-code:duration-200 hover:prose-code:bg-amber-400/20 hover:prose-code:scale-[1.03]
    `;

    return (
        <>
            {/* Backdrop */}
            <div 
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-20 transition-opacity duration-300 ${node ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
                aria-hidden="true"
            ></div>

            {/* Panel */}
            <aside
                className={`fixed top-0 right-0 h-full w-full max-w-lg bg-white dark:bg-gray-800 shadow-2xl z-30 transform transition-transform duration-300 ease-in-out ${node ? 'translate-x-0' : 'translate-x-full'}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="detail-panel-title"
            >
                {node && (
                    <div className="flex flex-col h-full">
                        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                            <h2 id="detail-panel-title" className="text-xl font-bold text-cyan-500 dark:text-cyan-400">{node.title}</h2>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                aria-label="Close details panel"
                            >
                                <CloseIcon className="w-6 h-6" />
                            </button>
                        </header>
                        <div ref={contentRef} className="flex-1 overflow-y-auto p-6">
                            <div
                                style={{
                                  '--bullet-light': customBulletSvgLight,
                                  '--bullet-dark': customBulletSvgDark,
                                } as React.CSSProperties}
                                className={richProseClasses}
                                dangerouslySetInnerHTML={{ __html: contentHtml }}
                            />
                        </div>
                    </div>
                )}
            </aside>
        </>
    );
};

export default NodeDetailPanel;
