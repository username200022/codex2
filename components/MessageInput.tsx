
import React, { useState } from 'react';

interface MessageInputProps {
    onSendMessage: (text: string) => void;
    isLoading: boolean;
}

const SendIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
    </svg>
);

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isLoading }) => {
    const [text, setText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim() && !isLoading) {
            onSendMessage(text);
            setText('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-3 max-w-4xl mx-auto">
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={isLoading ? "Waiting for response..." : "Ask for a business plan..."}
                disabled={isLoading}
                className="flex-1 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full py-3 px-5 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:outline-none disabled:opacity-50 transition-all"
                autoComplete="off"
            />
            <button
                type="submit"
                disabled={isLoading || !text.trim()}
                className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-cyan-500 text-white rounded-full disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-cyan-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-cyan-500"
                aria-label="Send message"
            >
                {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                ) : (
                    <SendIcon className="w-6 h-6" />
                )}
            </button>
        </form>
    );
};

export default MessageInput;
