
import React, { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';

// Define a mapping for potential icons with new, improved SVGs
const icons: Record<string, React.FC<{ className?: string }>> = {
    default: ({ className }) => <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>, // Default icon
    root: ({ className }) => <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.5 17.5h-1v-5.5h1v5.5zm-1-6.5h1v-1.5h-1V11z"/>, // Lightbulb/Idea icon
    formation: ({ className }) => <path d="M4.5 2.25a.75.75 0 00-1.5 0v1.5H1.5a.75.75 0 000 1.5h1.5v1.5H1.5a.75.75 0 000 1.5h1.5v1.5H1.5a.75.75 0 000 1.5h1.5v1.5a.75.75 0 001.5 0v-1.5h1.5a.75.75 0 000-1.5H4.5v-1.5h1.5a.75.75 0 000-1.5H4.5v-1.5h1.5a.75.75 0 000-1.5H4.5v-1.5zM19.5 7.5a.75.75 0 00-1.5 0v1.5h-1.5a.75.75 0 000 1.5h1.5v1.5a.75.75 0 001.5 0v-1.5h1.5a.75.75 0 000-1.5h-1.5V7.5zM12 21a9 9 0 100-18 9 9 0 000 18zm-3.5-9.5a.75.75 0 000 1.5h7a.75.75 0 000-1.5h-7z" />, // Legal/Bureaucracy
    capital: ({ className }) => <path d="M12 7.5a.75.75 0 01.75.75v3.372l3.47-1.946a.75.75 0 11.76 1.348l-3.832 2.158a.75.75 0 01-.758.01L8.27 12.03a.75.75 0 11.76-1.348l3.47 1.946V8.25A.75.75 0 0112 7.5zM1.5 12.75a.75.75 0 01.75-.75h19.5a.75.75 0 010 1.5H2.25a.75.75 0 01-.75-.75z" />, // Capital/Money
    equipment: ({ className }) => <path d="M11.25 3.75a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008zM12 6a.75.75 0 00-.75.75v.008a.75.75 0 00.75.75h.008a.75.75 0 00.75-.75V6.75a.75.75 0 00-.75-.75H12zM12 10.5a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008zM12 12.75a.75.75 0 00-.75.75v.008a.75.75 0 00.75.75h.008a.75.75 0 00.75-.75v-.008a.75.75 0 00-.75-.75H12zM12 17.25a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008z"/>, // Equipment/Services
    expenses: ({ className }) => <path d="M3.75 4.5A.75.75 0 003 5.25v13.5c0 .414.336.75.75.75h16.5a.75.75 0 00.75-.75V5.25a.75.75 0 00-.75-.75H3.75zM8.25 6a.75.75 0 01.75.75v10.5a.75.75 0 01-1.5 0V6.75a.75.75 0 01.75-.75zM12 6a.75.75 0 01.75.75v10.5a.75.75 0 01-1.5 0V6.75a.75.75 0 01.75-.75zm3.75 0a.75.75 0 01.75.75v10.5a.75.75 0 01-1.5 0V6.75a.75.75 0 01.75-.75z"/>, // Expenses
    competition: ({ className }) => <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12 18a6 6 0 110-12 6 6 0 010 12zm0-2.25a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5zM12 9a.75.75 0 110-1.5.75.75 0 010 1.5z"/>, // Competition
    market: ({ className }) => <path d="M2.25 13.5a.75.75 0 000 1.5h19.5a.75.75 0 000-1.5H2.25zM3.75 10.5a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75zM5.25 7.5a.75.75 0 000 1.5h13.5a.75.75 0 000-1.5H5.25zM6.75 4.5a.75.75 0 000 1.5h10.5a.75.75 0 000-1.5H6.75z"/>, // Market Analysis
};

const getIcon = (key?: string) => {
    if (!key) return icons.default;
    const lowerKey = key.toLowerCase();
    if (lowerKey === 'root') return icons.root;
    if (lowerKey.includes('form')) return icons.formation;
    if (lowerKey.includes('capital')) return icons.capital;
    if (lowerKey.includes('equip') || lowerKey.includes('servic')) return icons.equipment;
    if (lowerKey.includes('expense')) return icons.expenses;
    if (lowerKey.includes('compet')) return icons.competition;
    if (lowerKey.includes('market')) return icons.market;
    return icons.default;
};


interface CustomNodeData {
    label: string;
    icon?: string;
    color?: string;
}

function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0';
}

const CustomNodeComponent: React.FC<NodeProps<CustomNodeData>> = ({ data, selected }) => {
    const { label, icon, color = '#374151' } = data; // Default to gray-700
    const IconComponent = getIcon(icon);
    const rgbColor = hexToRgb(color);

    return (
        <div
            style={{
                background: `linear-gradient(145deg, rgba(${rgbColor}, 0.6), rgba(${rgbColor}, 0.9))`,
                boxShadow: selected ? `0 0 15px 2px rgba(${rgbColor}, 0.6)` : '0 4px 6px -1px rgba(0,0,0,0.4), 0 2px 4px -2px rgba(0,0,0,0.1)',
            }}
            className={`flex items-center gap-3 w-[220px] h-[60px] p-3 rounded-xl border-2 transition-all duration-200 ${
                selected ? 'border-cyan-400 scale-105' : 'border-gray-400 dark:border-gray-600'
            }`}
        >
            <Handle type="target" position={Position.Top} className="!bg-gray-400 dark:!bg-gray-500 !w-4 !h-2 !-top-2 !rounded-sm" />
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-black/20 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <IconComponent />
                </svg>
            </div>
            <div className="font-semibold text-white truncate">{label}</div>
            <Handle type="source" position={Position.Bottom} className="!bg-gray-400 dark:!bg-gray-500 !w-4 !h-2 !-bottom-2 !rounded-sm" />
        </div>
    );
};

export default memo(CustomNodeComponent);
