import { useState } from 'react';
import { useStore } from './useStore';
import SummaryCards from './components/SummaryCards';
import Charts from './components/Charts';
import TransactionList from './components/TransactionList';
import BudgetTracker from './components/BudgetTracker';
import AddTransactionModal from './components/AddTransactionModal';
import { Plus, DollarSign, LayoutDashboard, List, PieChart } from 'lucide-react';
import './index.css';

type Tab = 'dashboard' | 'transactions' | 'budgets';

export default function App() {
  const { data, addTransaction, deleteTransaction, upsertBudget, deleteBudget } = useStore();
  const [tab, setTab] = useState<Tab>('dashboard');
  const [showModal, setShowModal] = useState(false);

  const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: List },
    { id: 'budgets', label: 'Budgets', icon: PieChart },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <DollarSign size={16} className="text-white" />
            </div>
            <span className="font-semibold text-gray-900">MoneyApp</span>
          </div>

          <nav className="flex gap-1">
            {tabs.map(t => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                    ${tab === t.id ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                >
                  <Icon size={14} />
                  <span className="hidden sm:inline">{t.label}</span>
                </button>
              );
            })}
          </nav>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <Plus size={15} />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-5">
        {tab === 'dashboard' && (
          <>
            <SummaryCards transactions={data.transactions} />
            <Charts transactions={data.transactions} />
            <TransactionList
              transactions={data.transactions.slice(0, 10)}
              onDelete={deleteTransaction}
            />
          </>
        )}

        {tab === 'transactions' && (
          <TransactionList
            transactions={data.transactions}
            onDelete={deleteTransaction}
          />
        )}

        {tab === 'budgets' && (
          <div className="max-w-lg">
            <BudgetTracker
              transactions={data.transactions}
              budgets={data.budgets}
              onUpsert={upsertBudget}
              onDelete={deleteBudget}
            />
          </div>
        )}
      </main>

      {showModal && (
        <AddTransactionModal
          onAdd={addTransaction}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
