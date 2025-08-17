import React, { useState, useEffect } from 'react';
import { type SWOT } from '../types';
import { marked } from 'marked';

// --- ICONS ---

const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);

// New, professional icon set
const StrengthIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" />
    </svg>
);

const WeaknessIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
    </svg>
);

const OpportunityIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.354a15.056 15.056 0 01-4.5 0m3.75-12.013a15.056 15.056 0 01-4.5 0M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ThreatIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
);


interface SWOTQuadrantProps {
    title: string;
    items: string[];
    color: string;
    icon: React.FC<{ className?: string }>;
    onUpdate: (items: string[]) => void;
}

const SWOTQuadrant: React.FC<SWOTQuadrantProps> = ({ title, items, color, icon: IconComponent, onUpdate }) => {
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editText, setEditText] = useState('');

    const handleAddItem = () => {
        onUpdate([...items, `New ${title.slice(0, -1)}`]);
        // Set focus to the new item for editing immediately.
        setEditingIndex(items.length);
        setEditText(`New ${title.slice(0, -1)}`);
    };

    const handleDeleteItem = (index: number) => {
        onUpdate(items.filter((_, i) => i !== index));
    };

    const handleStartEditing = (index: number, text: string) => {
        setEditingIndex(index);
        setEditText(text);
    };

    const handleSaveEdit = (index: number) => {
        if (editText.trim() === '') {
            handleDeleteItem(index);
        } else {
            const newItems = [...items];
            newItems[index] = editText;
            onUpdate(newItems);
        }
        setEditingIndex(null);
        setEditText('');
    };

    const colorVariants = {
        'emerald': { text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500', ring: 'focus:ring-emerald-500', dot: 'bg-emerald-500' },
        'rose': { text: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-500', ring: 'focus:ring-rose-500', dot: 'bg-rose-500' },
        'sky': { text: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-500', ring: 'focus:ring-sky-500', dot: 'bg-sky-500' },
        'orange': { text: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-500', ring: 'focus:ring-orange-500', dot: 'bg-orange-500' },
    };

    const { text: textColor, dot: dotColor } = colorVariants[color as keyof typeof colorVariants];

    return (
        <div className="bg-white/70 dark:bg-gray-800/70 p-5 rounded-xl shadow-lg flex flex-col h-full ring-1 ring-black/5 dark:ring-white/10">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <IconComponent className={`w-8 h-8 ${textColor}`} />
                <h3 className={`text-xl font-bold ${textColor}`}>{title}</h3>
            </div>
            
            {/* List */}
            <ul className="space-y-3 flex-1 overflow-y-auto pr-2 -mr-2 mb-4">
                {items.map((item, index) => (
                    <li key={index} className="group flex items-start gap-3">
                        <div className={`w-1.5 h-1.5 rounded-full ${dotColor} mt-2 flex-shrink-0`}></div>
                        <div className="flex-1">
                            {editingIndex === index ? (
                                <input
                                    type="text"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    onBlur={() => handleSaveEdit(index)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(index)}
                                    className="w-full bg-transparent text-gray-800 dark:text-gray-200 focus:outline-none border-b-2 border-cyan-500"
                                    autoFocus
                                />
                            ) : (
                                <div
                                    className="text-gray-700 dark:text-gray-300 cursor-pointer prose prose-sm max-w-none prose-p:my-0"
                                    onClick={() => handleStartEditing(index, item)}
                                    dangerouslySetInnerHTML={{ __html: marked.parse(item) as string }}
                                />
                            )}
                        </div>
                         <button
                            onClick={() => handleDeleteItem(index)}
                            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            aria-label={`Delete item: ${item}`}
                        >
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </li>
                ))}
                 {items.length === 0 && (
                    <div className="text-center text-gray-400 dark:text-gray-500 py-8">
                        <p>No {title.toLowerCase()} yet.</p>
                    </div>
                )}
            </ul>
            
            {/* Add Button */}
            <div className="mt-auto">
                 <button
                    onClick={handleAddItem}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-gray-200/70 dark:bg-gray-700/70 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-cyan-500"
                    aria-label={`Add new ${title.slice(0,-1)}`}
                >
                    <PlusIcon className="w-4 h-4" />
                    Add {title.slice(0, -1)}
                </button>
            </div>
        </div>
    );
};


interface SWOTAnalysisViewProps {
    initialSwot: SWOT;
}

const SWOTAnalysisView: React.FC<SWOTAnalysisViewProps> = ({ initialSwot }) => {
    const [swotData, setSwotData] = useState<SWOT>(initialSwot);

    useEffect(() => {
        setSwotData(initialSwot);
    }, [initialSwot]);

    const handleUpdate = (category: keyof SWOT, items: string[]) => {
        setSwotData(prev => ({ ...prev, [category]: items }));
    };

    const quadrants = [
        { title: 'Strengths', category: 'strengths', color: 'emerald', icon: StrengthIcon },
        { title: 'Weaknesses', category: 'weaknesses', color: 'rose', icon: WeaknessIcon },
        { title: 'Opportunities', category: 'opportunities', color: 'sky', icon: OpportunityIcon },
        { title: 'Threats', category: 'threats', color: 'orange', icon: ThreatIcon },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2 h-[calc(100vh-200px)]">
            {quadrants.map(({ title, category, color, icon }) => (
                <SWOTQuadrant
                    key={title}
                    title={title}
                    items={swotData[category as keyof SWOT]}
                    color={color}
                    icon={icon}
                    onUpdate={(items) => handleUpdate(category as keyof SWOT, items)}
                />
            ))}
        </div>
    );
};

export default SWOTAnalysisView;