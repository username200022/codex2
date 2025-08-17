import React, { useState, useEffect } from 'react';
import { getConversations, createConversation, signOut } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface ConversationSidebarProps {
  currentConversationId: string | null;
  onConversationSelect: (conversationId: string) => void;
  onNewConversation: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

const PlusIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
  </svg>
);

const ChatIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
  </svg>
);

const LogoutIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
  </svg>
);

const MenuIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
  </svg>
);

const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  currentConversationId,
  onConversationSelect,
  onNewConversation,
  isOpen,
  onToggle
}) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const { data, error } = await getConversations();
      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewConversation = async () => {
    try {
      const { data, error } = await createConversation('New Business Plan');
      if (error) throw error;
      if (data) {
        setConversations(prev => [data, ...prev]);
        onConversationSelect(data.id);
      }
      onNewConversation();
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <MenuIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Conversations
              </h2>
              <button
                onClick={handleNewConversation}
                className="p-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
                title="New conversation"
              >
                <PlusIcon className="w-5 h-5" />
              </button>
            </div>
            
            {/* User info */}
            {user && (
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  {user.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="Profile"
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {user.user_metadata?.full_name || user.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  title="Sign out"
                >
                  <LogoutIcon className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Conversations list */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-8">
                <ChatIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No conversations yet. Start a new one!
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => {
                      onConversationSelect(conversation.id);
                      if (window.innerWidth < 1024) onToggle();
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      currentConversationId === conversation.id
                        ? 'bg-cyan-100 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-700'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {conversation.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatDate(conversation.updated_at)}
                        </p>
                      </div>
                      <ChatIcon className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default ConversationSidebar;