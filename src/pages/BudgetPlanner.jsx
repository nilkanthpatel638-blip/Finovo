import React, { useContext, useState } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { GlassPanel } from '../components/GlassPanel';
import { Icon } from '../components/Icon';
import { formatIndianRupees } from '../utils/financeUtils';

export const BudgetPlanner = () => {
  const { budgets, setBudgets, transactions, currency } = useContext(FinanceContext);
  const [editingCat, setEditingCat] = useState(null);
  const [newLimit, setNewLimit] = useState('');

  // Calculate actual June 2026 expenditures per category
  const getSpentAmount = (catName) => {
    return transactions
      .filter(t => t.type === 'expense' && t.category.toLowerCase() === catName.toLowerCase() && t.date.startsWith('2026-06'))
      .reduce((acc, curr) => acc + curr.amount, 0);
  };

  const handleEditClick = (cat, limit) => {
    setEditingCat(cat);
    setNewLimit(limit.toString());
  };

  const handleSaveBudget = (cat) => {
    if (newLimit === '' || isNaN(Number(newLimit))) return;
    setBudgets(prev => ({
      ...prev,
      [cat]: Number(newLimit)
    }));
    setEditingCat(null);
  };

  // Quick preset updates
  const handleQuickAdjustment = (cat, currentLimit, amount) => {
    const nextLimit = Math.max(0, currentLimit + amount);
    setBudgets(prev => ({
      ...prev,
      [cat]: nextLimit
    }));
  };

  // Calculate overall budget statistics
  const totalBudgeted = Object.values(budgets).reduce((a, b) => a + b, 0);
  const totalSpent = Object.keys(budgets).reduce((acc, cat) => acc + getSpentAmount(cat), 0);
  const overallPercent = totalBudgeted > 0 ? Math.min(100, Math.round((totalSpent / totalBudgeted) * 100)) : 0;

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Monthly Budget Planner</h1>
        <p className="text-slate-500 dark:text-slate-400">Set limits for categories and monitor your spending thresholds.</p>
      </div>

      {/* Aggregate Overview Card */}
      <GlassPanel className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center border-emerald/20">
        <div className="space-y-1">
          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Monthly Budgeted</span>
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">{formatIndianRupees(totalBudgeted, currency)}</h2>
        </div>

        <div className="space-y-1">
          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Spent (June)</span>
          <h2 className="text-3xl font-extrabold text-rose-500">{formatIndianRupees(totalSpent, currency)}</h2>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-500">Overall Allocation spent</span>
            <span className={`font-bold ${overallPercent > 80 ? 'text-rose-500' : 'text-emerald'}`}>{overallPercent}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-navy-light h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                overallPercent > 90 ? 'bg-red-500' : overallPercent > 80 ? 'bg-amber-500' : 'bg-emerald'
              }`}
              style={{ width: `${overallPercent}%` }}
            />
          </div>
        </div>
      </GlassPanel>

      {/* Budget Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.keys(budgets).map(cat => {
          const limit = budgets[cat];
          const spent = getSpentAmount(cat);
          const remaining = limit - spent;
          const percent = limit > 0 ? Math.round((spent / limit) * 100) : 0;
          const isWarning = percent >= 80 && percent < 100;
          const isExceeded = percent >= 100;
          
          let progressColor = 'bg-emerald';
          if (isWarning) progressColor = 'bg-amber-500';
          if (isExceeded) progressColor = 'bg-red-500';

          return (
            <GlassPanel key={cat} hoverEffect className="space-y-4 flex flex-col justify-between h-full">
              {/* Category info */}
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="font-bold text-lg">{cat}</span>
                  <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                    <Icon name="Calendar" size={12} />
                    <span>June Budget</span>
                  </div>
                </div>

                {isExceeded ? (
                  <span className="bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full text-[10px] font-bold border border-red-500/20">
                    LIMIT EXCEEDED
                  </span>
                ) : isWarning ? (
                  <span className="bg-amber-500/15 text-amber-500 px-2 py-0.5 rounded-full text-[10px] font-bold border border-amber-500/20">
                    &gt;80% SPENT
                  </span>
                ) : null}
              </div>

              {/* Progress visual */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Spent: {formatIndianRupees(spent, currency)}</span>
                  <span className="font-bold">{percent}%</span>
                </div>
                
                <div className="w-full bg-slate-200 dark:bg-navy-light h-2.5 rounded-full overflow-hidden">
                  <div 
                    className={`${progressColor} h-full rounded-full transition-all duration-300`} 
                    style={{ width: `${Math.min(100, percent)}%` }}
                  />
                </div>
              </div>

              {/* Numerical stats */}
              <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-300/10 dark:border-white/5 bg-slate-100/30 dark:bg-navy-dark/20 p-2.5 rounded-xl">
                <div>
                  <span className="text-slate-500 block mb-0.5">Budgeted</span>
                  {editingCat === cat ? (
                    <div className="flex items-center space-x-1.5">
                      <input 
                        type="number"
                        value={newLimit}
                        onChange={(e) => setNewLimit(e.target.value)}
                        className="w-16 bg-white dark:bg-navy-dark border border-slate-400/30 rounded px-1.5 py-0.5 text-xs focus:outline-none"
                      />
                      <button 
                        onClick={() => handleSaveBudget(cat)}
                        className="p-1 bg-emerald text-white rounded hover:bg-emerald-dark"
                      >
                        <Icon name="Check" size={10} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1">
                      <span className="font-bold">{formatIndianRupees(limit, currency)}</span>
                      <button 
                        onClick={() => handleEditClick(cat, limit)}
                        className="text-slate-400 hover:text-white p-0.5 rounded"
                      >
                        <Icon name="Edit2" size={10} />
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">Remaining</span>
                  <span className={`font-bold ${remaining < 0 ? 'text-rose-500' : 'text-slate-800 dark:text-white'}`}>
                    {remaining < 0 ? '-' : ''}{formatIndianRupees(Math.abs(remaining), currency)}
                  </span>
                </div>
              </div>

              {/* Adjust budget limits slider */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] text-slate-400 block">Quick adjustment</span>
                <div className="flex justify-between items-center gap-1">
                  <button 
                    onClick={() => handleQuickAdjustment(cat, limit, -1000)}
                    className="px-2 py-1 bg-slate-200 dark:bg-navy-light text-[10px] rounded hover:bg-slate-300 dark:hover:bg-slate-800 font-bold"
                  >
                    -₹1K
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="1000"
                    value={limit}
                    onChange={(e) => {
                      const nextVal = Number(e.target.value);
                      setBudgets(prev => ({ ...prev, [cat]: nextVal }));
                    }}
                    className="w-full accent-emerald cursor-pointer h-1.5 bg-slate-300 dark:bg-slate-800 rounded-lg"
                  />
                  <button 
                    onClick={() => handleQuickAdjustment(cat, limit, 1000)}
                    className="px-2 py-1 bg-slate-200 dark:bg-navy-light text-[10px] rounded hover:bg-slate-300 dark:hover:bg-slate-800 font-bold"
                  >
                    +₹1K
                  </button>
                </div>
              </div>
            </GlassPanel>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetPlanner;
