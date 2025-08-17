import { createClient } from '@supabase/supabase-js';
import { type Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

// Database helpers
export const createConversation = async (title: string) => {
  const { data, error } = await supabase
    .from('conversations')
    .insert({ title })
    .select()
    .single();
  return { data, error };
};

export const getConversations = async () => {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .order('updated_at', { ascending: false });
  return { data, error };
};

export const getConversationMessages = async (conversationId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });
  return { data, error };
};

export const createMessage = async (
  conversationId: string,
  role: 'user' | 'assistant',
  content: string,
  messageType: 'text' | 'plan' | 'questions' = 'text',
  metadata: any = {}
) => {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      role,
      content,
      message_type: messageType,
      metadata
    })
    .select()
    .single();
  return { data, error };
};

export const saveBusinessPlan = async (
  conversationId: string,
  title: string,
  content: string,
  financialData: any = null,
  swotData: any = null,
  planContext: any = {}
) => {
  const { data, error } = await supabase
    .from('business_plans')
    .insert({
      conversation_id: conversationId,
      title,
      content,
      financial_data: financialData,
      swot_data: swotData,
      plan_context: planContext
    })
    .select()
    .single();
  return { data, error };
};

export const getBusinessPlans = async () => {
  const { data, error } = await supabase
    .from('business_plans')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
};

export const updateConversationTitle = async (conversationId: string, title: string) => {
  const { data, error } = await supabase
    .from('conversations')
    .update({ title })
    .eq('id', conversationId)
    .select()
    .single();
  return { data, error };
};