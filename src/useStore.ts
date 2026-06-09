import { useState, useEffect } from 'react';
import type { AppData, Transaction, Budget } from './types';
import { format } from 'date-fns';

const STORAGE_KEY = 'moneyapp_data';

const SEED_DATA: AppData = {
  transactions: [
    { id: '1', type: 'income', amount: 3500, category: 'Salary', description: 'Monthly salary', date: format(new Date(), 'yyyy-MM-01') },
    { id: '2', type: 'expense', amount: 900, category: 'Housing', description: 'Rent', date: format(new Date(), 'yyyy-MM-02') },
    { id: '3', type: 'expense', amount: 120, category: 'Food', description: 'Groceries', date: format(new Date(), 'yyyy-MM-05') },
    { id: '4', type: 'expense', amount: 45, category: 'Transport', description: 'Bus pass', date: format(new Date(), 'yyyy-MM-07') },
    { id: '5', type: 'income', amount: 800, category: 'Freelance', description: 'Web project', date: format(new Date(), 'yyyy-MM-10') },
    { id: '6', type: 'expense', amount: 60, category: 'Entertainment', description: 'Streaming + movies', date: format(new Date(), 'yyyy-MM-12') },
    { id: '7', type: 'expense', amount: 200, category: 'Shopping', description: 'Clothes', date: format(new Date(), 'yyyy-MM-15') },
    { id: '8', type: 'expense', amount: 80, category: 'Health', description: 'Gym membership', date: format(new Date(), 'yyyy-MM-18') },
  ],
  budgets: [
    { category: 'Housing', limit: 1000 },
    { category: 'Food', limit: 300 },
    { category: 'Transport', limit: 100 },
    { category: 'Entertainment', limit: 100 },
    { category: 'Shopping', limit: 250 },
    { category: 'Health', limit: 150 },
  ],
};

function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return SEED_DATA;
}

function saveData(data: AppData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useStore() {
  const [data, setData] = useState<AppData>(loadData);

  useEffect(() => {
    saveData(data);
  }, [data]);

  function addTransaction(tx: Omit<Transaction, 'id'>) {
    setData(d => ({
      ...d,
      transactions: [
        { ...tx, id: crypto.randomUUID() },
        ...d.transactions,
      ],
    }));
  }

  function deleteTransaction(id: string) {
    setData(d => ({
      ...d,
      transactions: d.transactions.filter(t => t.id !== id),
    }));
  }

  function upsertBudget(budget: Budget) {
    setData(d => {
      const existing = d.budgets.findIndex(b => b.category === budget.category);
      if (existing >= 0) {
        const budgets = [...d.budgets];
        budgets[existing] = budget;
        return { ...d, budgets };
      }
      return { ...d, budgets: [...d.budgets, budget] };
    });
  }

  function deleteBudget(category: string) {
    setData(d => ({
      ...d,
      budgets: d.budgets.filter(b => b.category !== category),
    }));
  }

  return { data, addTransaction, deleteTransaction, upsertBudget, deleteBudget };
}
