import React, { useState, useEffect } from 'react';
import { type MarketingItem } from '../../types';

interface MarketingCostModalProps {
    isOpen: boolean;
    onClose: () => void;
    marketingItems: MarketingItem[];
    onUpdate: (items: MarketingItem[]) => void;
    currency: string;
}

const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 0,
    }).format(value);
};

const CloseIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);

const MarketingCostModal: React.FC<MarketingCostModalProps> = ({ isOpen, onClose, marketingItems, onUpdate, currency }) => {
    const [localItems, setLocalItems] = useState<MarketingItem[]>([]);

    useEffect(() => {
        if (isOpen) {
            setLocalItems(JSON.parse(JSON.stringify(marketingItems)));
        }
    }, [isOpen, marketingItems]);

    const handleItemChange = (id: string, field: keyof Omit<MarketingItem, 'id'>, value: string | number) => {
        setLocalItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    };

    const handleAddItem = () => {
        const newItem: MarketingItem = {
            id: `marketing-${Date.now()}`,
            channel: 'New Channel',
            cost: 500
        };
        setLocalItems(prev => [...prev, newItem]);
    };
    
    const handleRemoveItem = (id: string) => {
        setLocalItems(prev => prev.filter(item => item.id !== id));
    };

    const handleSaveChanges = () => {
        onUpdate(localItems);
        onClose();
    };

    const totalCost = localItems.reduce((sum, item) => sum + item.cost, 0);
    
    if (!isOpen) return null;

    return (
        <>
            <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
                onClick={handleSaveChanges}
                aria-hidden="true"
            ></div>
            
            <div
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-white dark:bg-gray-800 shadow-2xl z-50 rounded-2xl transform transition-transform duration-300 ease-in-out"
                role="dialog"
                aria-modal="true"
                aria-labelledby="marketing-modal-title"
            >
                <div className="flex flex-col h-full max-h-[80vh]">
                    <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
                        <h2 id="marketing-modal-title" className="text-xl font-bold text-cyan-500 dark:text-cyan-400">Marketing Spend Breakdown</h2>
                        <button
                            onClick={handleSaveChanges}
                            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            aria-label="Close"
                        >
                            <CloseIcon className="w-6 h-6" />
                        </button>
                    </header>
                    
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-500 dark:text-gray-400 px-2">
                            <div className="col-span-7">Channel</div>
                            <div className="col-span-4 text-right">Monthly Cost</div>
                            <div className="col-span-1"></div>
                        </div>

                        {localItems.map(item => (
                            <div key={item.id} className="grid grid-cols-12 gap-4 items-center bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                                <input
                                    type="text"
                                    value={item.channel}
                                    onChange={e => handleItemChange(item.id, 'channel', e.target.value)}
                                    className="col-span-7 bg-transparent focus:outline-none focus:ring-1 focus:ring-cyan-500 rounded p-1"
                                />
                                <div className="col-span-4 flex items-center justify-end">
                                    <span className="text-gray-400 mr-1">{currency}</span>
                                    <input
                                        type="number"
                                        value={item.cost}
                                        onChange={e => handleItemChange(item.id, 'cost', parseInt(e.target.value) || 0)}
                                        min="0"
                                        className="bg-transparent focus:outline-none focus:ring-1 focus:ring-cyan-500 rounded p-1 text-right w-24"
                                    />
                                </div>
                                <button onClick={() => handleRemoveItem(item.id)} className="col-span-1 text-gray-400 hover:text-red-500">
                                    <TrashIcon className="w-5 h-5"/>
                                </button>
                            </div>
                        ))}
                         <button
                            onClick={handleAddItem}
                            className="w-full py-2 px-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-cyan-500 hover:text-cyan-500 transition-colors"
                        >
                            + Add Channel
                        </button>
                    </div>
                    
                    <footer className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800">
                        <div className="font-bold text-lg text-gray-800 dark:text-gray-200">
                            Total Monthly Marketing: <span className="text-cyan-500">{formatCurrency(totalCost, currency)}</span>
                        </div>
                        <button
                            onClick={handleSaveChanges}
                            className="bg-cyan-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-cyan-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-cyan-500"
                        >
                            Done
                        </button>
                    </footer>
                </div>
            </div>
        </>
    );
};

export default MarketingCostModal;
