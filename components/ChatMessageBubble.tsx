
import React from 'react';
import { marked } from 'marked';
import { type ChatMessage, Role } from '../types';

// --- ICONS ---
const UserIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
);

const AssistantIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
       <path d="M12 2C9.25 2 7 4.25 7 7c0 .91.24 1.76.66 2.52-.75.6-1.35 1.4-1.63 2.33-.24.78-.33 1.62-.27 2.47.1.92.53 1.79 1.15 2.5.49.56 1.09 1.02 1.77 1.36.1.75.31 1.47.63 2.14.28.6.64 1.15 1.07 1.63.21.24.5.37.8.37s.59-.13.8-.37c.43-.48.79-1.03 1.07-1.63.32-.67.53-1.39.63-2.14.68-.34 1.28-.79 1.77-1.36.62-.71 1.05-1.58 1.15-2.5.06-.85-.03-1.69-.27-2.47-.28-.93-.88-1.73-1.63-2.33.42-.76.66-1.61.66-2.52C17 4.25 14.75 2 12 2z"/>
    </svg>
);

// --- MARKDOWN CONFIG ---
marked.use({
  async: false,
  gfm: true,
  breaks: true,
});

interface ChatMessageBubbleProps {
    message: ChatMessage;
}

const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message }) => {
    const isUser = message.role === Role.USER;

    const wrapperClasses = `flex items-start gap-3 w-full max-w-4xl mx-auto ${isUser ? 'flex-row-reverse' : 'flex-row'}`;
    const bubbleClasses = `p-4 rounded-2xl w-fit ${isUser ? 'bg-blue-600 text-white rounded-br-lg max-w-2xl' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-bl-lg max-w-2xl'}`;
    const iconWrapperClasses = `flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isUser ? 'bg-blue-500' : 'bg-cyan-500'}`;
    
    // Simple content rendering with markdown.
    // The complex plan rendering is now handled by PlanWorkspace.
    const contentHtml = marked.parse(message.content) as string;

    return (
        <div className={wrapperClasses}>
            <div className={iconWrapperClasses}>
                {isUser ? <UserIcon className="w-6 h-6 text-white"/> : <AssistantIcon className="w-6 h-6 text-white"/>}
            </div>
            <div className={bubbleClasses}>
                <div
                    className="prose dark:prose-invert max-w-none prose-p:my-0"
                    dangerouslySetInnerHTML={{ __html: contentHtml }}
                />
            </div>
        </div>
    );
};

export default ChatMessageBubble;
