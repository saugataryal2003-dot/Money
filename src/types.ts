export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface Budget {
  category: string;
  limit: number;
}

export interface AppData {
  transactions: Transaction[];
  budgets: Budget[];
}

export const EXPENSE_CATEGORIES = [
  'Housing', 'Food', 'Transport', 'Health', 'Entertainment',
  'Shopping', 'Education', 'Utilities', 'Other',
];

export const INCOME_CATEGORIES = [
  'Salary', 'Freelance', 'Investment', 'Gift', 'Business', 'Other',
];

export const CATEGORY_COLORS: Record<string, string> = {
  Housing: '#6366f1',
  Food: '#f59e0b',
  Transport: '#10b981',
  Health: '#ef4444',
  Entertainment: '#8b5cf6',
  Shopping: '#ec4899',
  Education: '#14b8a6',
  Utilities: '#f97316',
  Other: '#6b7280',
  Salary: '#22c55e',
  Freelance: '#3b82f6',
  Investment: '#a855f7',
  Gift: '#fb7185',
  Business: '#06b6d4',
};
