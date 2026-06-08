import React, { useContext, useState } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { GlassPanel } from '../components/GlassPanel';
import { Icon } from '../components/Icon';
import { formatIndianRupees } from '../utils/financeUtils';

export const Dashboard = () => {
  const { 
    transactions, 
    addTransaction,
    updateTransaction,
    investments, 
    addInvestment,
    deleteInvestment,
    goals, 
    addGoal,
    deleteGoal,
    widgets, 
    updateWidgetLayout, 
    currency,
    setActivePage,
    startingBalance,
    setStartingBalance,
    categories
  } = useContext(FinanceContext);

  const [draggedIndex, setDraggedIndex] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Dashboard card edit overlays state
  const [activeEditCard, setActiveEditCard] = useState(null);
  
  // Form states
  const [editStartBalance, setEditStartBalance] = useState('');
  const [editIncome, setEditIncome] = useState('');
  const [editEmergencyTarget, setEditEmergencyTarget] = useState('');
  const [editEmergencySaved, setEditEmergencySaved] = useState('');

  // Quick expense log state
  const [quickExpAmount, setQuickExpAmount] = useState('');
  const [quickExpCat, setQuickExpCat] = useState('');
  const [quickExpNotes, setQuickExpNotes] = useState('');

  // Investment holdings quick value update state
  const [editingInvId, setEditingInvId] = useState(null);
  const [editInvValue, setEditInvValue] = useState('');

  // Compute stats based on actual transactions & investments
  const monthlyIncome = transactions
    .filter(t => t.type === 'income' && t.date.includes('2026-06'))
    .reduce((acc, curr) => acc + curr.amount, 0);

  const monthlyExpenses = transactions
    .filter(t => t.type === 'expense' && t.date.includes('2026-06'))
    .reduce((acc, curr) => acc + curr.amount, 0);

  const savings = Math.max(0, monthlyIncome - monthlyExpenses);

  const totalInvestments = investments.reduce((acc, curr) => acc + curr.currentValue, 0);

  const emergencyFundGoal = goals.find(g => g.name.toLowerCase().includes('emergency'));
  const emergencyFund = emergencyFundGoal?.savedAmount || 0;
  
  // Total balance = startingBalance + allIncomes - allExpenses
  const allIncomes = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const allExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const totalBalance = startingBalance + allIncomes - allExpenses;

  // Card definition mapping
  const cardData = {
    'total-balance': {
      title: 'Total Balance',
      value: totalBalance,
      icon: 'Wallet',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      trend: '+4.8%',
      isPositive: true,
      desc: 'Combined bank and cash holdings'
    },
    'monthly-income': {
      title: 'Monthly Income',
      value: monthlyIncome,
      icon: 'ArrowUpRight',
      color: 'text-emerald',
      bgColor: 'bg-emerald/10',
      trend: '+12.4%',
      isPositive: true,
      desc: 'Salary, side gigs & dividends'
    },
    'monthly-expenses': {
      title: 'Monthly Expenses',
      value: monthlyExpenses,
      icon: 'ArrowDownRight',
      color: 'text-rose-500',
      bgColor: 'bg-rose-500/10',
      trend: '-2.1%',
      isPositive: false,
      desc: 'Food, rent, EMI & shopping'
    },
    'savings': {
      title: 'Savings',
      value: savings,
      icon: 'TrendingUp',
      color: 'text-gold',
      bgColor: 'bg-gold/10',
      trend: '+8.3%',
      isPositive: true,
      desc: 'Liquid savings this month'
    },
    'investments': {
      title: 'Investments',
      value: totalInvestments,
      icon: 'Activity',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      trend: '+14.2%',
      isPositive: true,
      desc: 'Mutual funds, stocks & gold'
    },
    'emergency-fund': {
      title: 'Emergency Fund',
      value: emergencyFund,
      icon: 'Shield',
      color: 'text-teal-500',
      bgColor: 'bg-teal-500/10',
      trend: 'On Track',
      isPositive: true,
      desc: 'Safety reserve for contingencies'
    }
  };

  // Drag and drop event handlers
  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newWidgets = [...widgets];
    const draggedItem = newWidgets[draggedIndex];
    
    // Swap items
    newWidgets.splice(draggedIndex, 1);
    newWidgets.splice(index, 0, draggedItem);
    
    // Update temporary index
    setDraggedIndex(index);
    updateWidgetLayout(newWidgets);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Toggle widget visibility
  const toggleWidget = (id) => {
    const updated = widgets.map(w => w.id === id ? { ...w, visible: !w.visible } : w);
    updateWidgetLayout(updated);
  };

  // Open Edit Modals
  const handleEditCardClick = (id) => {
    setActiveEditCard(id);
    if (id === 'total-balance') {
      setEditStartBalance(startingBalance);
    } else if (id === 'monthly-income') {
      setEditIncome(monthlyIncome || 85000);
    } else if (id === 'emergency-fund') {
      setEditEmergencyTarget(emergencyFundGoal?.targetAmount || 300000);
      setEditEmergencySaved(emergencyFundGoal?.savedAmount || 0);
    } else if (id === 'monthly-expenses') {
      setQuickExpAmount('');
      setQuickExpCat(categories[0]?.name || 'Food');
      setQuickExpNotes('');
    }
  };

  // Save Modals details
  const handleSaveStartBalance = (e) => {
    e.preventDefault();
    const val = Number(editStartBalance);
    setStartingBalance(val);
    localStorage.setItem('startingBalance', val.toString());
    setActiveEditCard(null);
  };

  const handleSaveIncome = (e) => {
    e.preventDefault();
    const val = Number(editIncome);
    const salaryTx = transactions.find(t => t.category === 'Salary' && t.type === 'income');
    
    if (salaryTx) {
      updateTransaction({ ...salaryTx, amount: val });
    } else {
      addTransaction({
        type: 'income',
        amount: val,
        category: 'Salary',
        date: new Date().toISOString().substring(0, 10),
        notes: 'Income adjusted from Dashboard',
        paymentMethod: 'Direct Deposit'
      });
    }
    setActiveEditCard(null);
  };

  const handleSaveQuickExpense = (e) => {
    e.preventDefault();
    if (!quickExpAmount || isNaN(Number(quickExpAmount))) return;
    addTransaction({
      type: 'expense',
      amount: Number(quickExpAmount),
      category: quickExpCat,
      date: new Date().toISOString().substring(0, 10),
      notes: quickExpNotes || 'Logged from Dashboard',
      paymentMethod: 'UPI'
    });
    setActiveEditCard(null);
  };

  const handleSaveEmergencyFund = (e) => {
    e.preventDefault();
    const target = Number(editEmergencyTarget);
    const saved = Number(editEmergencySaved);

    if (emergencyFundGoal) {
      deleteGoal(emergencyFundGoal.id);
      addGoal({
        name: 'Emergency Fund',
        targetAmount: target,
        savedAmount: saved,
        deadline: emergencyFundGoal.deadline || new Date(Date.now() + 365*24*60*60*1000).toISOString().substring(0,10),
        monthlyContribution: emergencyFundGoal.monthlyContribution || 10000,
        icon: 'Shield'
      });
    } else {
      addGoal({
        name: 'Emergency Fund',
        targetAmount: target,
        savedAmount: saved,
        deadline: new Date(Date.now() + 365*24*60*60*1000).toISOString().substring(0,10),
        monthlyContribution: 10000,
        icon: 'Shield'
      });
    }
    setActiveEditCard(null);
  };

  const handleQuickInvestmentValSave = (e, holding) => {
    e.preventDefault();
    if (!editInvValue || isNaN(Number(editInvValue))) return;
    
    deleteInvestment(holding.id);
    addInvestment({
      type: holding.type,
      name: holding.name,
      investedAmount: holding.investedAmount,
      currentValue: Number(editInvValue),
      sipAmount: holding.sipAmount || 0
    });
    setEditingInvId(null);
    setEditInvValue('');
  };

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
      {/* Upper header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Financial Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">Welcome back! Adjust figures directly or customize widgets.</p>
        </div>
        
        {/* Toggle editing layout */}
        <button
          onClick={() => setIsEditMode(!isEditMode)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border ${
            isEditMode 
              ? 'bg-emerald text-white border-emerald' 
              : 'bg-slate-200 dark:bg-navy-light text-slate-800 dark:text-white border-slate-300 dark:border-white/10'
          }`}
        >
          <Icon name={isEditMode ? 'Check' : 'Sliders'} size={16} />
          <span>{isEditMode ? 'Done Customizing' : 'Customize Widgets'}</span>
        </button>
      </div>

      {/* Grid configuration panel in Edit Mode */}
      {isEditMode && (
        <GlassPanel className="p-4 border-emerald/30 animate-pulse">
          <div className="flex items-center space-x-2 mb-3 text-emerald">
            <Icon name="Info" size={18} />
            <h3 className="font-bold text-sm">Dashboard Edit Mode Active</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Toggle checkboxes to hide/show widgets, or drag and drop cards to change their order on your screen.
          </p>
          <div className="flex flex-wrap gap-3">
            {widgets.map(w => (
              <label 
                key={w.id} 
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border transition-all ${
                  w.visible 
                    ? 'bg-emerald/10 text-emerald border-emerald/30' 
                    : 'bg-slate-100 dark:bg-navy-dark text-slate-400 border-slate-300/30'
                }`}
              >
                <input 
                  type="checkbox" 
                  checked={w.visible} 
                  onChange={() => toggleWidget(w.id)}
                  className="rounded text-emerald focus:ring-emerald cursor-pointer"
                />
                <span>{cardData[w.id]?.title}</span>
              </label>
            ))}
          </div>
        </GlassPanel>
      )}

      {/* Main metrics grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {widgets
          .filter(w => w.visible)
          .map((widget, index) => {
            const data = cardData[widget.id];
            if (!data) return null;

            return (
              <div
                key={widget.id}
                draggable={isEditMode}
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`transition-all duration-300 ${isEditMode ? 'cursor-grab active:cursor-grabbing border-2 border-dashed border-emerald/40 rounded-2xl' : ''}`}
              >
                <GlassPanel hoverEffect className="relative h-full flex flex-col justify-between">
                  {/* Pencil Edit trigger overlay */}
                  <div className="absolute top-3 right-3 flex items-center space-x-1.5 z-10">
                    {widget.id !== 'savings' && (
                      <button
                        onClick={() => handleEditCardClick(widget.id)}
                        className="p-1 rounded text-slate-400 hover:text-emerald hover:bg-emerald/15 transition-all"
                        title={`Edit ${data.title}`}
                      >
                        <Icon name="Edit2" size={12} />
                      </button>
                    )}
                    {isEditMode && (
                      <div className="p-1 text-emerald hover:bg-emerald/10 rounded cursor-grab">
                        <Icon name="Menu" size={12} />
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                        {data.title}
                      </span>
                      <h2 className="text-3xl font-extrabold tracking-tight pt-1">
                        {formatIndianRupees(data.value, currency)}
                      </h2>
                    </div>

                    <div className={`p-3 rounded-xl ${data.bgColor} ${data.color}`}>
                      <Icon name={data.icon} size={22} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-300/20 dark:border-white/5 text-xs">
                    <span className="text-slate-400 font-medium">{data.desc}</span>
                    <span className={`font-bold flex items-center ${data.isPositive ? 'text-emerald' : 'text-rose-500'}`}>
                      <Icon name={data.isPositive ? 'ArrowUpRight' : 'ArrowDownRight'} size={12} className="mr-0.5" />
                      {data.trend}
                    </span>
                  </div>
                </GlassPanel>
              </div>
            );
          })}
      </div>

      {/* Secondary layout sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        {/* Recent Ledger Panel */}
        <GlassPanel className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold">Recent Transactions</h3>
            <button 
              onClick={() => setActivePage('expenses')}
              className="text-xs font-semibold text-emerald hover:underline flex items-center space-x-1"
            >
              <span>View Ledger</span>
              <Icon name="ArrowRight" size={12} />
            </button>
          </div>

          <div className="divide-y divide-slate-300/25 dark:divide-white/5">
            {transactions.slice(0, 5).map(t => (
              <div key={t.id} className="py-4 flex justify-between items-center first:pt-0 last:pb-0">
                <div className="flex items-center space-x-3">
                  <div className={`p-2.5 rounded-xl ${t.type === 'income' ? 'bg-emerald/10 text-emerald' : 'bg-rose-500/10 text-rose-500'}`}>
                    <Icon name={t.type === 'income' ? 'ArrowUpRight' : 'ArrowDownRight'} size={18} />
                  </div>
                  <div>
                    <span className="font-semibold text-sm block">{t.category}</span>
                    <span className="text-xs text-slate-500">{t.date} • {t.paymentMethod}</span>
                  </div>
                </div>
                
                <div className="text-right space-y-1">
                  <span className={`font-bold text-sm block ${t.type === 'income' ? 'text-emerald' : 'text-slate-800 dark:text-white'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatIndianRupees(t.amount, currency)}
                  </span>
                  {t.notes && <span className="text-[10px] text-slate-500 block max-w-[150px] truncate">{t.notes}</span>}
                </div>
              </div>
            ))}

            {transactions.length === 0 && (
              <p className="text-center py-8 text-xs text-slate-500">No transactions recorded yet.</p>
            )}
          </div>
        </GlassPanel>

        {/* Dynamic Goals Summary Panel */}
        <GlassPanel className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold">Goals Progress</h3>
            <button 
              onClick={() => setActivePage('goals')}
              className="text-xs font-semibold text-emerald hover:underline flex items-center space-x-1"
            >
              <span>Manage Goals</span>
              <Icon name="ArrowRight" size={12} />
            </button>
          </div>

          <div className="space-y-4">
            {goals.slice(0, 3).map(g => {
              const percent = Math.min(100, Math.round((g.savedAmount / g.targetAmount) * 100));
              return (
                <div key={g.id} className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold">{g.name}</span>
                    <span className="text-slate-400">{percent}%</span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 dark:bg-navy-light h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-gold h-full rounded-full transition-all duration-500" 
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Saved: {formatIndianRupees(g.savedAmount, currency)}</span>
                    <span>Target: {formatIndianRupees(g.targetAmount, currency)}</span>
                  </div>
                </div>
              );
            })}

            {goals.length === 0 && (
              <p className="text-center py-8 text-xs text-slate-500">No active goals. Go to Goals to add one.</p>
            )}
          </div>
        </GlassPanel>
      </div>

      {/* ================= EDIT MODALS CONTAINER ================= */}
      
      {/* 1. Total Balance Modal */}
      {activeEditCard === 'total-balance' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <GlassPanel className="w-full max-w-sm border-blue-500/20 animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold flex items-center space-x-2">
                <Icon name="Wallet" className="text-blue-500" />
                <span>Adjust Savings Balance</span>
              </h3>
              <button onClick={() => setActiveEditCard(null)} className="text-slate-500 hover:text-white">
                <Icon name="X" size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSaveStartBalance} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-500">Starting Savings & Cash holdings ({currency})</label>
                <input
                  type="number"
                  value={editStartBalance}
                  onChange={(e) => setEditStartBalance(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 font-semibold"
                  required
                />
              </div>

              <div className="pt-2 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setActiveEditCard(null)}
                  className="w-1/2 border border-slate-300 dark:border-white/10 py-2 rounded-xl text-xs hover:bg-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-blue-500 text-white font-bold py-2 rounded-xl text-xs hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </GlassPanel>
        </div>
      )}

      {/* 2. Monthly Income Modal */}
      {activeEditCard === 'monthly-income' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <GlassPanel className="w-full max-w-sm border-emerald/20 animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold flex items-center space-x-2">
                <Icon name="ArrowUpRight" className="text-emerald" />
                <span>Adjust Monthly Income</span>
              </h3>
              <button onClick={() => setActiveEditCard(null)} className="text-slate-500 hover:text-white">
                <Icon name="X" size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSaveIncome} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-500">Current Monthly salary credit ({currency})</label>
                <input
                  type="number"
                  value={editIncome}
                  onChange={(e) => setEditIncome(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald font-semibold"
                  required
                />
              </div>

              <div className="pt-2 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setActiveEditCard(null)}
                  className="w-1/2 border border-slate-300 dark:border-white/10 py-2 rounded-xl text-xs hover:bg-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-emerald text-white font-bold py-2 rounded-xl text-xs hover:bg-emerald-dark"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </GlassPanel>
        </div>
      )}

      {/* 3. Monthly Expenses (Quick log) Modal */}
      {activeEditCard === 'monthly-expenses' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <GlassPanel className="w-full max-w-sm border-rose-500/20 animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold flex items-center space-x-2">
                <Icon name="ArrowDownRight" className="text-rose-500" />
                <span>Log Dashboard Expense</span>
              </h3>
              <button onClick={() => setActiveEditCard(null)} className="text-slate-500 hover:text-white">
                <Icon name="X" size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSaveQuickExpense} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-500">Expense Amount ({currency})</label>
                <input
                  type="number"
                  placeholder="₹ Amount spent"
                  value={quickExpAmount}
                  onChange={(e) => setQuickExpAmount(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 dark:border-white/5 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-500">Category</label>
                <select
                  value={quickExpCat}
                  onChange={(e) => setQuickExpCat(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 dark:border-white/5 rounded-xl px-3 py-2 text-sm focus:outline-none"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-500">Notes / Details</label>
                <input
                  type="text"
                  placeholder="e.g. Starbucks Coffee"
                  value={quickExpNotes}
                  onChange={(e) => setQuickExpNotes(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 dark:border-white/5 rounded-xl px-4 py-2 text-sm focus:outline-none"
                />
              </div>

              <div className="pt-2 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setActiveEditCard(null)}
                  className="w-1/2 border border-slate-300 dark:border-white/10 py-2 rounded-xl text-xs hover:bg-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-rose-500 text-white font-bold py-2 rounded-xl text-xs hover:bg-rose-600"
                >
                  Record Expense
                </button>
              </div>
            </form>
          </GlassPanel>
        </div>
      )}

      {/* 4. Investments Modal */}
      {activeEditCard === 'investments' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <GlassPanel className="w-full max-w-md border-purple-500/20 animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold flex items-center space-x-2">
                <Icon name="Activity" className="text-purple-500" />
                <span>Adjust Investment Holdings</span>
              </h3>
              <button onClick={() => { setActiveEditCard(null); setEditingInvId(null); }} className="text-slate-500 hover:text-white">
                <Icon name="X" size={18} />
              </button>
            </div>
            
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              <p className="text-xs text-slate-500">Update current value of your holdings directly:</p>
              
              {investments.map(inv => (
                <div key={inv.id} className="p-3 bg-slate-100 dark:bg-navy-dark/40 border border-slate-300/25 dark:border-white/5 rounded-xl flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-xs block">{inv.name}</span>
                    <span className="text-[10px] text-slate-500">Principal: {formatIndianRupees(inv.investedAmount, currency)}</span>
                  </div>

                  {editingInvId === inv.id ? (
                    <form onSubmit={(e) => handleQuickInvestmentValSave(e, inv)} className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={editInvValue}
                        onChange={(e) => setEditInvValue(e.target.value)}
                        className="w-24 bg-white dark:bg-navy-dark border border-slate-400/30 rounded px-2 py-0.5 text-xs text-right"
                        required
                        placeholder="New Value"
                      />
                      <button type="submit" className="p-1 bg-emerald text-white rounded text-[10px]">
                        <Icon name="Check" size={10} />
                      </button>
                      <button type="button" onClick={() => setEditingInvId(null)} className="p-1 bg-rose-500 text-white rounded text-[10px]">
                        <Icon name="X" size={10} />
                      </button>
                    </form>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs font-mono">{formatIndianRupees(inv.currentValue, currency)}</span>
                      <button 
                        onClick={() => { setEditingInvId(inv.id); setEditInvValue(inv.currentValue); }}
                        className="text-slate-400 hover:text-emerald p-1"
                      >
                        <Icon name="Edit2" size={10} />
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {investments.length === 0 && (
                <p className="text-center py-6 text-xs text-slate-500">No active investment holdings.</p>
              )}
            </div>

            <div className="pt-4 border-t border-slate-300/10 dark:border-white/5 mt-4">
              <button
                onClick={() => { setActiveEditCard(null); setActivePage('investments'); }}
                className="w-full bg-slate-200 dark:bg-navy-light text-slate-800 dark:text-white font-bold py-2 rounded-xl text-xs hover:bg-slate-300 dark:hover:bg-slate-800"
              >
                Go to Investments Settings
              </button>
            </div>
          </GlassPanel>
        </div>
      )}

      {/* 5. Emergency Fund Modal */}
      {activeEditCard === 'emergency-fund' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <GlassPanel className="w-full max-w-sm border-teal-500/20 animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold flex items-center space-x-2">
                <Icon name="Shield" className="text-teal-500" />
                <span>Adjust Emergency Fund</span>
              </h3>
              <button onClick={() => setActiveEditCard(null)} className="text-slate-500 hover:text-white">
                <Icon name="X" size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSaveEmergencyFund} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-500">Fund Goal Target ({currency})</label>
                <input
                  type="number"
                  value={editEmergencyTarget}
                  onChange={(e) => setEditEmergencyTarget(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-500">Currently Saved ({currency})</label>
                <input
                  type="number"
                  value={editEmergencySaved}
                  onChange={(e) => setEditEmergencySaved(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              <div className="pt-2 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setActiveEditCard(null)}
                  className="w-1/2 border border-slate-300 dark:border-white/10 py-2 rounded-xl text-xs hover:bg-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-teal-500 text-white font-bold py-2 rounded-xl text-xs hover:bg-teal-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </GlassPanel>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
