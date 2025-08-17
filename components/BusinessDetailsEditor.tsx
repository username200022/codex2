
import React, { useState, useEffect } from 'react';
import { type PlanContext } from '../types';

interface BusinessDetailsEditorProps {
    context: PlanContext;
    onRegenerate: (newAnswers: Record<number, string>) => void;
}

const QuoteIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 17h3l2-4V7H5v6h3l-2 4zm8 0h3l2-4V7h-6v6h3l-2 4z"/>
  </svg>
);


const BusinessDetailsEditor: React.FC<BusinessDetailsEditorProps> = ({ context, onRegenerate }) => {
    const [editedAnswers, setEditedAnswers] = useState<Record<number, string>>(context.answers);
    const [hasChanged, setHasChanged] = useState(false);

    useEffect(() => {
        setEditedAnswers(context.answers);
        setHasChanged(false); // Reset changed status when context updates
    }, [context]);

    const handleAnswerChange = (questionIndex: number, value: string) => {
        const newAnswers = { ...editedAnswers, [questionIndex]: value };
        setEditedAnswers(newAnswers);
        setHasChanged(JSON.stringify(newAnswers) !== JSON.stringify(context.answers));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onRegenerate(editedAnswers);
    };

    return (
        <div className="p-4 md:p-2">
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Business Details</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-2xl mx-auto">Edit your original answers and regenerate the plan, or see the additional requirements you've added via chat.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                    <h3 className="text-lg font-semibold text-cyan-500 dark:text-cyan-400 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Initial Q&A</h3>
                    <div className="space-y-6">
                        {context.questions.map((q, index) => (
                            <div key={index} className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                                <label htmlFor={`answer-${index}`} className="block font-semibold text-gray-800 dark:text-gray-200 mb-3">{q.question}</label>
                                <select
                                    id={`answer-${index}`}
                                    value={editedAnswers[index] || ''}
                                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                                    className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-4 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
                                >
                                    {q.options.map((option, oIndex) => (
                                        <option key={oIndex} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>
                </div>

                {context.additionalRequirements && context.additionalRequirements.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold text-cyan-500 dark:text-cyan-400 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Additional Requirements</h3>
                        <div className="space-y-4">
                            {context.additionalRequirements.map((req, index) => (
                                <div key={index} className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-4 border border-gray-200 dark:border-gray-700 flex gap-4 items-start">
                                    <QuoteIcon className="w-6 h-6 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-1" />
                                    <p className="text-gray-700 dark:text-gray-300 italic">"{req.content}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="pt-6 border-t border-gray-200/60 dark:border-gray-700/60 mt-4">
                    <button
                        type="submit"
                        disabled={!hasChanged}
                        className="w-full bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-700 transition-colors disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 focus:ring-cyan-500"
                    >
                        {hasChanged ? 'Regenerate Plan with Edits' : 'No Changes to Q&A'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BusinessDetailsEditor;
