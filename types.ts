export enum Role {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
  SUMMARY = 'summary', // A special internal role for summarized content
}

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
}

export interface QuestionWithOptions {
  question: string;
  options: string[];
}

export interface AiResponse {
  text: string; // The main text part of the response (preamble, conversational part)
  planContent?: string; // The actual plan markdown, if it exists
  questions: QuestionWithOptions[]; // The list of questions, if any
}

export interface PlanContext {
  questions: QuestionWithOptions[];
  answers: Record<number, string>;
  additionalRequirements: ChatMessage[];
}

// --- Types for Financial Dashboard & Projections ---

export interface CapitalItem {
  item: string;
  cost: number;
  currency: string;
}

export interface ExpenseItem {
  item: string;
  monthlyCost: number;
  currency: string;
}

export interface StaffItem {
  id: string;
  role: string;
  headcount: number;
  salary: number;
}

export interface MarketingItem {
  id: string;
  channel: string;
  cost: number;
}

export interface CustomCostItem {
  id: string;
  name: string;
  monthlyCost: number;
}

export type FinancialDriverType = 'staff' | 'marketing' | 'rent' | 'generic';

export interface FinancialDriver {
  name: string;
  type: FinancialDriverType;
  initialCost: number;
}

export interface FinancialData {
  initialCapital: CapitalItem[];
  recurringExpenses: ExpenseItem[];
  totalInitialCapital: number;
  totalRecurringExpenses: number;
  currency: string;
  drivers: FinancialDriver[]; // AI-driven controls for the projection view
}

// --- Type for SWOT Analysis ---
export interface SWOT {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

// --- Type for Clarifying Questions Form ---
export interface ClarifyingQuestionsState {
  preamble: string;
  questions: QuestionWithOptions[];
}