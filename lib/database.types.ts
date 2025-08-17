export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          user_id: string
          title: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          role: 'user' | 'assistant'
          content: string
          message_type: 'text' | 'plan' | 'questions'
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          role: 'user' | 'assistant'
          content: string
          message_type?: 'text' | 'plan' | 'questions'
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          role?: 'user' | 'assistant'
          content?: string
          message_type?: 'text' | 'plan' | 'questions'
          metadata?: Json
          created_at?: string
        }
      }
      business_plans: {
        Row: {
          id: string
          conversation_id: string
          user_id: string
          title: string
          content: string
          financial_data: Json | null
          swot_data: Json | null
          plan_context: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          user_id: string
          title: string
          content: string
          financial_data?: Json | null
          swot_data?: Json | null
          plan_context?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          user_id?: string
          title?: string
          content?: string
          financial_data?: Json | null
          swot_data?: Json | null
          plan_context?: Json
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}