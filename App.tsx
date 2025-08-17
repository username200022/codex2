

import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import LoginPage from './components/LoginPage';
import AuthCallback from './components/AuthCallback';
import ConversationSidebar from './components/ConversationSidebar';
import { 
    createMessage, 
    getConversationMessages, 
    saveBusinessPlan, 
    updateConversationTitle,
    createConversation 
} from './lib/supabase';
import { type ChatMessage, Role, type QuestionWithOptions, type PlanContext, type ClarifyingQuestionsState } from './types';
// --- API SERVICE SWITCH ---
// To use the REAL Gemini API, use the geminiService import.
// To use the mock data for unlimited, free, offline testing, comment out the line below and uncomment the mock import.
import { getAiResponse, getWittyLoadingMessages } from './services/geminiService';
// import { getAiResponse, getWittyLoadingMessages } from './services/mockGeminiService';
import MessageInput from './components/MessageInput';
import ChatMessageBubble from './components/ChatMessageBubble';
import TypingIndicator from './components/TypingIndicator';
import { Header } from './components/Layout';
import PlanGenerationLoader from './components/PlanGenerationLoader';
import PlanWorkspace from './components/PlanWorkspace';
import ClarifyingQuestionsForm from './components/ClarifyingQuestionsForm';
import { parsePlan } from './utils/plan-parser';

type WorkspaceView = 'flowchart' | 'text' | 'dashboard' | 'details' | 'swot' | 'projections';

const BrainIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C9.25 2 7 4.25 7 7c0 .91.24 1.76.66 2.52-.75.6-1.35 1.4-1.63 2.33-.24.78-.33 1.62-.27 2.47.1.92.53 1.79 1.15 2.5.49.56 1.09 1.02 1.77 1.36.1.75.31 1.47.63 2.14.28.6.64 1.15 1.07 1.63.21.24.5.37.8.37s.59-.13.8-.37c.43-.48.79-1.03 1.07-1.63.32-.67.53-1.39.63-2.14.68-.34 1.28-.79 1.77-1.36.62-.71 1.05-1.58 1.15-2.5.06-.85-.03-1.69-.27-2.47-.28-.93-.88-1.73-1.63-2.33.42-.76.66-1.61.66-2.52C17 4.25 14.75 2 12 2zm-1 14.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5zm2 0c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5zM12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"/>
    </svg>
);

const WelcomeMessage: React.FC<{onSendMessage: (text: string) => void}> = ({ onSendMessage }) => {
    const examplePrompts = [
        "How do I start a coffee shop in Berlin?",
        "Create a business plan for an online clothing store.",
        "What are the initial capital requirements for a tech startup?",
        "Analyze the competition for a new restaurant in Paris."
    ];

    return (
        <div className="text-center flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 px-4">
            <BrainIcon className="w-24 h-24 text-gray-400 dark:text-gray-600 mb-6" />
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">Welcome!</h2>
            <p className="max-w-xl mb-8">
                I'm your data-driven AI consultant. Ask me anything to get started, from market analysis to a full business plan. For example:
            </p>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-3xl mx-auto">
                {examplePrompts.map((prompt, i) => (
                    <button 
                        key={i} 
                        onClick={() => onSendMessage(prompt)}
                        className="bg-gray-200/60 dark:bg-gray-800/50 p-4 rounded-lg text-left text-gray-700 dark:text-gray-300 hover:bg-gray-300/80 dark:hover:bg-gray-700/80 transition-colors duration-200"
                    >
                        <p>{prompt}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};


const MainApp: React.FC = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [clarifyingQuestions, setClarifyingQuestions] = useState<ClarifyingQuestionsState | null>(null);
    const [lastPlan, setLastPlan] = useState<{ message: ChatMessage; context: PlanContext } | null>(null);
    const [wittyMessages, setWittyMessages] = useState<string[]>([]);
    const [isWorkspaceView, setIsWorkspaceView] = useState(false);
    const [activeWorkspaceView, setActiveWorkspaceView] = useState<WorkspaceView>('flowchart');
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Load conversation messages when conversation changes
    useEffect(() => {
        if (currentConversationId) {
            loadConversationMessages(currentConversationId);
        }
    }, [currentConversationId]);

    const loadConversationMessages = async (conversationId: string) => {
        try {
            const { data, error } = await getConversationMessages(conversationId);
            if (error) throw error;
            
            const chatMessages: ChatMessage[] = (data || []).map(msg => ({
                id: msg.id,
                role: msg.role === 'user' ? Role.USER : Role.ASSISTANT,
                content: msg.content
            }));
            
            setMessages(chatMessages);
            
            // Check if there's a plan in the messages and set up workspace
            const planMessage = chatMessages.find(msg => 
                msg.role === Role.ASSISTANT && msg.content.includes('Business Plan:')
            );
            
            if (planMessage) {
                const { financialData } = parsePlan(planMessage.content);
                // Set up lastPlan context if needed
                setLastPlan({ 
                    message: planMessage, 
                    context: { questions: [], answers: {}, additionalRequirements: [] }
                });
                setIsWorkspaceView(true);
            }
        } catch (error) {
            console.error('Error loading conversation messages:', error);
        }
    };

    const handleConversationSelect = (conversationId: string) => {
        setCurrentConversationId(conversationId);
        setIsWorkspaceView(false);
        setLastPlan(null);
        setClarifyingQuestions(null);
    };

    const handleNewConversation = async () => {
        try {
            const { data, error } = await createConversation('New Business Plan');
            if (error) throw error;
            if (data) {
                setCurrentConversationId(data.id);
                setMessages([]);
                setIsWorkspaceView(false);
                setLastPlan(null);
                setClarifyingQuestions(null);
            }
        } catch (error) {
            console.error('Error creating conversation:', error);
        }
    };

    const initialUserQuery = messages.find(m => m.role === Role.USER)?.content || '';

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (!isWorkspaceView || isLoading) {
            scrollToBottom();
        }
    }, [messages, isLoading, isWorkspaceView]);

    const handleSendMessage = async (text: string, submissionContext?: Omit<PlanContext, 'additionalRequirements'>) => {
        if (!text.trim() && !submissionContext) return;
        
        // Create conversation if none exists
        let conversationId = currentConversationId;
        if (!conversationId) {
            const { data, error } = await createConversation('New Business Plan');
            if (error) {
                console.error('Error creating conversation:', error);
                return;
            }
            conversationId = data!.id;
            setCurrentConversationId(conversationId);
        }

        const newUserMessage: ChatMessage = {
            id: `user-${Date.now()}`,
            role: Role.USER,
            content: text,
        };

        const updatedMessages = [...messages, newUserMessage];
        setMessages(updatedMessages);
        
        // Save user message to database
        try {
            await createMessage(conversationId!, 'user', text);
        } catch (error) {
            console.error('Error saving user message:', error);
        }

        if (!isWorkspaceView) {
            setIsWorkspaceView(true);
        }
        
        setIsLoading(true);
        
        const topic = messages.find(m => m.role === Role.USER)?.content || text;
        setWittyMessages([]);
        getWittyLoadingMessages(topic).then(setWittyMessages);

        try {
            const response = await getAiResponse(updatedMessages);
            const isFinalPlan = !!response.planContent;

            let finalMessages = [...updatedMessages];

            if (isFinalPlan) {
                if (response.text) {
                    const aiTextMessage: ChatMessage = {
                        id: `assistant-text-${Date.now()}`,
                        role: Role.ASSISTANT,
                        content: response.text,
                    };
                    finalMessages.push(aiTextMessage);
                    
                    // Save AI text message to database
                    try {
                        await createMessage(conversationId!, 'assistant', response.text, 'text');
                    } catch (error) {
                        console.error('Error saving AI text message:', error);
                    }
                }

                const newPlanMessage: ChatMessage = {
                    id: `assistant-plan-${Date.now()}`,
                    role: Role.ASSISTANT,
                    content: response.planContent!,
                };
                
                let newContext: PlanContext;

                if (submissionContext) { // First plan generation OR regeneration from details view
                    newContext = {
                        ...submissionContext,
                        // If lastPlan exists, it's a regeneration, so keep old requirements.
                        // Otherwise, it's the first plan, so initialize to empty.
                        additionalRequirements: lastPlan ? lastPlan.context.additionalRequirements : [],
                    };
                } else if (lastPlan) { // Plan regeneration from chat amendment
                    newContext = {
                        ...lastPlan.context,
                        additionalRequirements: [...lastPlan.context.additionalRequirements, newUserMessage],
                    };
                } else {
                     // This case should ideally not be hit if logic is correct, but as a fallback:
                    newContext = {
                        questions: [],
                        answers: {},
                        additionalRequirements: [newUserMessage]
                    };
                }
                
                setLastPlan({ message: newPlanMessage, context: newContext });
                
                // Save plan message and business plan to database
                try {
                    await createMessage(conversationId!, 'assistant', response.planContent!, 'plan');
                    
                    const { title, financialData, swotData } = parsePlan(response.planContent!);
                    await saveBusinessPlan(
                        conversationId!,
                        title,
                        response.planContent!,
                        financialData,
                        swotData,
                        newContext
                    );
                    
                    // Update conversation title if it's still default
                    if (title && title !== 'New Business Plan') {
                        await updateConversationTitle(conversationId!, title);
                    }
                } catch (error) {
                    console.error('Error saving plan:', error);
                }

                // Add a canned follow-up question, ONLY on the very first generation.
                if (!lastPlan) {
                    const followupMessage: ChatMessage = {
                        id: `assistant-followup-${Date.now()}`,
                        role: Role.ASSISTANT,
                        content: "Here is your initial business plan. Does this align with your vision? Feel free to provide any additional details or requirements you'd like me to incorporate."
                    };
                    finalMessages.push(followupMessage);
                    
                    // Save follow-up message to database
                    try {
                        await createMessage(conversationId!, 'assistant', followupMessage.content);
                    } catch (error) {
                        console.error('Error saving follow-up message:', error);
                    }
                }

                setActiveWorkspaceView('text');
                setClarifyingQuestions(null); // Clear any open questions

            } else if (response.questions.length > 0) {
                // This is a response with clarifying questions.
                // The conversational part (`response.text`) is the preamble to the questions.
                // We set it in the state for the form, NOT in the chat history.
                setClarifyingQuestions({
                    preamble: response.text,
                    questions: response.questions,
                });
                
            } else {
                 // It's a simple conversational response.
                 if (response.text) {
                    const aiTextMessage: ChatMessage = {
                        id: `assistant-text-${Date.now()}`,
                        role: Role.ASSISTANT,
                        content: response.text,
                    };
                    finalMessages.push(aiTextMessage);
                    
                    // Save AI text message to database
                    try {
                        await createMessage(conversationId!, 'assistant', response.text);
                    } catch (error) {
                        console.error('Error saving AI message:', error);
                    }
                }
                setClarifyingQuestions(null); // Clear any old questions
            }

            setMessages(finalMessages);

        } catch (error) {
            console.error("Failed to get AI response:", error);
            const errorMessage: ChatMessage = {
                id: `error-${Date.now()}`,
                role: Role.ASSISTANT,
                content: "I'm sorry, but I'm having trouble connecting. Please try again later.",
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
            setWittyMessages([]);
        }
    };
    
    const handleSubmitAnswers = (answers: Record<number, string>) => {
        if (!clarifyingQuestions) return;

        const answersText = clarifyingQuestions.questions.map((q, index) => {
            return `${q.question}\nMy Answer: ${answers[index]}`;
        }).join('\n\n');
        
        const context = { questions: clarifyingQuestions.questions, answers };
        
        setClarifyingQuestions(null);
        handleSendMessage(answersText, context);
    };

    const handleRegeneratePlan = (newAnswers: Record<number, string>) => {
        if (!lastPlan) return;
        const answersText = lastPlan.context.questions.map((q, index) => {
            return `${q.question}\nMy Answer: ${newAnswers[index]}`;
        }).join('\n\n');
        
        const newContext = {
            questions: lastPlan.context.questions,
            answers: newAnswers
        };
        
        // Hide old plan, which shows loader in right panel. 
        // We set only the message to null, keeping the context for the regeneration logic in handleSendMessage.
        setLastPlan(prev => prev ? { ...prev, message: { id: '', role: Role.ASSISTANT, content: ''} } : null); 
        handleSendMessage(answersText, newContext);
    };
    
    const RightPanelContent = () => {
        if (isLoading && !clarifyingQuestions) {
             return <PlanGenerationLoader topic={initialUserQuery} />;
        }
        if (clarifyingQuestions) {
            return <ClarifyingQuestionsForm 
                preamble={clarifyingQuestions.preamble}
                questions={clarifyingQuestions.questions}
                onSubmit={handleSubmitAnswers}
            />;
        }
        if (lastPlan && lastPlan.message.content) { // Render if there's actual plan content
            return <PlanWorkspace 
                        plan={lastPlan.message}
                        context={lastPlan.context}
                        onRegenerate={handleRegeneratePlan}
                        currentView={activeWorkspaceView}
                        onViewChange={setActiveWorkspaceView}
                   />;
        }
        // This case handles the moment during regeneration when lastPlan exists but message is cleared
        if (isLoading || (lastPlan && !lastPlan.message.content)) {
            return <PlanGenerationLoader topic={initialUserQuery} />;
        }
        return (
            <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-500 p-8 text-center">
                <p>The AI's response and your full business plan will appear here once generated.</p>
            </div>
        );
    };

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
            <ConversationSidebar
                currentConversationId={currentConversationId}
                onConversationSelect={handleConversationSelect}
                onNewConversation={handleNewConversation}
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen(!sidebarOpen)}
            />
            
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                {isWorkspaceView ? (
                    <div className="flex flex-1 overflow-hidden">
                        {/* Left Panel: Chat History */}
                        <aside className="w-full max-w-md lg:max-w-lg flex flex-col bg-white/50 dark:bg-gray-800/50 border-r border-gray-200 dark:border-gray-700">
                            <main className="flex-1 overflow-y-auto p-4 space-y-6">
                                {messages.map((msg) => (
                                    <ChatMessageBubble key={msg.id} message={msg} />
                                ))}
                                {isLoading && !clarifyingQuestions && (
                                    <TypingIndicator wittyMessages={wittyMessages} />
                                )}
                                <div ref={chatEndRef} />
                            </main>
                             <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
                                <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading || !!clarifyingQuestions} />
                            </footer>
                        </aside>
                        {/* Right Panel: Workspace */}
                        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
                            <RightPanelContent />
                        </main>
                    </div>
                ) : (
                    <div className="flex flex-col flex-1 overflow-hidden">
                        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                           <WelcomeMessage onSendMessage={handleSendMessage} />
                        </main>
                        <footer className="bg-gray-100/50 dark:bg-gray-900/50 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 p-4 md:p-6">
                            <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
                        </footer>
                    </div>
                )}
            </div>
        </div>
    );
};

const App: React.FC = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-cyan-500/50 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <Router>
            <Routes>
                <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/" element={user ? <MainApp /> : <Navigate to="/login" />} />
            </Routes>
        </Router>
    );
};

export default App;
        </div>
    );
};

export default App;
