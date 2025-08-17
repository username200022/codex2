import React, { useState, useEffect } from 'react';

interface EditableCostControlProps {
    label: string;
    value: number;
    currency: string;
    onSave: (newValue: number) => void;
}

const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 0,
    }).format(value);
};

const EditableCostControl: React.FC<EditableCostControlProps> = ({ label, value, currency, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentValue, setCurrentValue] = useState(value.toString());

    useEffect(() => {
        // Update local state if the prop value changes from outside
        setCurrentValue(value.toString());
    }, [value]);

    const handleSave = () => {
        const newValue = parseInt(currentValue, 10);
        if (!isNaN(newValue) && newValue !== value) {
            onSave(newValue);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            setCurrentValue(value.toString());
            setIsEditing(false);
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-baseline">
                <label className="font-semibold text-gray-700 dark:text-gray-300">{label}</label>
                {isEditing ? (
                    <div className="flex items-center">
                         <span className="text-gray-400 mr-1">{currency}</span>
                        <input
                            type="number"
                            value={currentValue}
                            onChange={(e) => setCurrentValue(e.target.value)}
                            onBlur={handleSave}
                            onKeyDown={handleKeyDown}
                            className="font-mono text-cyan-600 dark:text-cyan-400 bg-gray-200 dark:bg-gray-700 rounded-md p-1 text-right w-28 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            autoFocus
                        />
                    </div>
                ) : (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="font-mono text-cyan-600 dark:text-cyan-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md p-1 -m-1 transition-colors"
                        aria-label={`Edit ${label}`}
                    >
                        {formatCurrency(value, currency)}
                    </button>
                )}
            </div>
            <div className="w-full py-2 px-4 rounded-lg bg-gray-200/70 dark:bg-gray-700/70 text-center text-gray-500 dark:text-gray-400">
                Click value to edit
            </div>
        </div>
    );
};

export default EditableCostControl;
