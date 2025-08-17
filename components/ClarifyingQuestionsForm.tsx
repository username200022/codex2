import React, { useState } from 'react';
import { marked } from 'marked';
import { type QuestionWithOptions } from '../types';
import OptionButton from './OptionButton';

interface ClarifyingQuestionsFormProps {
    preamble: string;
    questions: QuestionWithOptions[];
    onSubmit: (answers: Record<number, string>) => void;
}

const ClarifyingQuestionsForm: React.FC<ClarifyingQuestionsFormProps> = ({ preamble, questions, onSubmit }) => {
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});

    const handleOptionSelect = (questionIndex: number, option: string) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionIndex]: option,
        }));
    };

    const handleSubmit = () => {
        onSubmit(selectedAnswers);
    };

    const allQuestionsAnswered = questions.length > 0 && Object.keys(selectedAnswers).length === questions.length;
    const preambleHtml = marked.parse(preamble) as string;

    return (
        <div className="flex flex-col h-full p-4 md:p-8">
            <div 
                className="mb-6 prose dark:prose-invert max-w-none prose-p:my-2 prose-headings:text-2xl prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-gray-100"
                dangerouslySetInnerHTML={{ __html: preambleHtml }}
            />
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 -mr-2">
                {questions.map((q, qIndex) => (
                    <div key={qIndex} className="w-full bg-white/70 dark:bg-gray-800/70 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <p className="font-semibold text-gray-800 dark:text-gray-200 mb-3">{q.question}</p>
                        <div className="flex flex-col gap-2">
                            {q.options.map((option, oIndex) => (
                                <OptionButton 
                                    key={oIndex} 
                                    text={option} 
                                    onClick={() => handleOptionSelect(qIndex, option)} 
                                    isSelected={selectedAnswers[qIndex] === option}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="pt-6 border-t border-gray-200/60 dark:border-gray-700/60 mt-4">
                 <button
                    onClick={handleSubmit}
                    disabled={!allQuestionsAnswered}
                    className="w-full bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-700 transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-500 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 focus:ring-cyan-500"
                >
                    Submit Answers
                </button>
            </div>
        </div>
    );
};

export default ClarifyingQuestionsForm;
