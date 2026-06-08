import React, { useContext, useState } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { GlassPanel } from '../components/GlassPanel';
import { Icon } from '../components/Icon';
import { formatIndianRupees } from '../utils/financeUtils';

export const ExpenseTracker = () => {
  const { 
    transactions, 
    addTransaction, 
    deleteTransaction, 
    updateTransaction,
    categories,
    addCategory,
    deleteCategory,
    renameCategory,
    currency 
  } = useContext(FinanceContext);

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');

  // Form modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [isCatPanelOpen, setIsCatPanelOpen] = useState(false);

  // New Transaction form state
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  // New Category form state
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Tag');
  const [newCatColor, setNewCatColor] = useState('#10B981');

  // Icons list for selection
  const SELECTABLE_ICONS = [
    'Tag', 'Coffee', 'Utensils', 'Car', 'Home', 'ShoppingBag', 'Plane', 'Film', 
    'Activity', 'GraduationCap', 'Wrench', 'TrendingUp', 'Shield', 'Gift', 'Gamepad',
    'Book', 'Music', 'Heart', 'Phone', 'Tv', 'Wifi', 'Briefcase', 'Globe', 'Zap'
  ];

  // Colors list
  const SELECTABLE_COLORS = [
    '#10B981', '#3B82F6', '#EF4444', '#F59E0B', '#EC4899', '#8B5CF6', 
    '#6366F1', '#14B8A6', '#06B6D4', '#64748B', '#F4B400', '#10B981'
  ];

  const handleOpenAddModal = () => {
    setEditingTx(null);
    setAmount('');
    setType('expense');
    setCategory(categories[0]?.name || 'Food');
    setDate(new Date().toISOString().substring(0, 10));
    setNotes('');
    setPaymentMethod('UPI');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (tx) => {
    setEditingTx(tx);
    setAmount(tx.amount.toString());
    setType(tx.type);
    setCategory(tx.category);
    setDate(tx.date);
    setNotes(tx.notes);
    setPaymentMethod(tx.paymentMethod);
    setIsModalOpen(true);
  };

  const handleSubmitTx = (e) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;

    const txData = {
      amount: Number(amount),
      type,
      category,
      date,
      notes,
      paymentMethod
    };

    if (editingTx) {
      updateTransaction({ ...txData, id: editingTx.id });
    } else {
      addTransaction(txData);
    }
    setIsModalOpen(false);
  };

  const handleAddCategorySubmit = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory(newCatName.trim(), newCatIcon, newCatColor);
    setNewCatName('');
  };

  // Filtered transactions
  const filteredTransactions = transactions
    .filter(t => {
      const matchSearch = (t.notes || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (t.category || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = filterType === 'all' || t.type === filterType;
      const matchCategory = filterCategory === 'all' || t.category === filterCategory;
      return matchSearch && matchType && matchCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'amount-desc') return b.amount - a.amount;
      if (sortBy === 'amount-asc') return a.amount - b.amount;
      return 0;
    });

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Ledger & Expense Tracker</h1>
          <p className="text-slate-500 dark:text-slate-400">Add transactions, categorize spending, and filter expenses.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsCatPanelOpen(!isCatPanelOpen)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-navy-light text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-all"
          >
            <Icon name="Tag" size={16} className="text-gold" />
            <span>Manage Categories</span>
          </button>
          
          <button
            onClick={handleOpenAddModal}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald text-white hover:bg-emerald-dark hover:scale-[1.02] shadow-lg transition-all"
          >
            <Icon name="Plus" size={16} />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Category Manager panel */}
      {isCatPanelOpen && (
        <GlassPanel className="border-gold/30">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold flex items-center space-x-2">
              <Icon name="Tag" className="text-gold" />
              <span>Category Settings</span>
            </h3>
            <button onClick={() => setIsCatPanelOpen(false)} className="text-slate-500 hover:text-slate-200">
              <Icon name="X" size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Create Category form */}
            <form onSubmit={handleAddCategorySubmit} className="lg:col-span-4 space-y-4">
              <h4 className="font-semibold text-sm">Add Custom Category</h4>
              <div className="space-y-1">
                <label className="text-xs text-slate-500">Category Name</label>
                <input 
                  type="text" 
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Pet Care, Subscriptions"
                  className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 dark:border-white/5 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-gold"
                  required
                />
              </div>

              {/* Icon Picker */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 block">Choose Icon</label>
                <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto p-1 bg-slate-100 dark:bg-navy-dark/40 rounded-xl border border-slate-300/30 dark:border-white/5">
                  {SELECTABLE_ICONS.map(ic => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setNewCatIcon(ic)}
                      className={`p-1.5 rounded-lg flex items-center justify-center border transition-all ${
                        newCatIcon === ic 
                          ? 'bg-gold/20 border-gold text-gold' 
                          : 'border-transparent text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon name={ic} size={16} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Picker */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 block">Choose Color</label>
                <div className="flex gap-2 flex-wrap">
                  {SELECTABLE_COLORS.map(col => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setNewCatColor(col)}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${
                        newCatColor === col ? 'border-white scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-gold text-navy font-bold py-2 rounded-xl text-sm hover:bg-gold-light transition-all"
              >
                Create Category
              </button>
            </form>

            {/* List & Edit existing Categories */}
            <div className="lg:col-span-8 space-y-4">
              <h4 className="font-semibold text-sm">Active Categories</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-2">
                {categories.map(cat => (
                  <div 
                    key={cat.id} 
                    className="flex justify-between items-center p-3 bg-slate-100 dark:bg-navy-dark/50 rounded-xl border border-slate-300/20 dark:border-white/5"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-lg text-white" style={{ backgroundColor: cat.color }}>
                        <Icon name={cat.icon || 'Tag'} size={14} />
                      </div>
                      <span className="text-xs font-semibold">{cat.name}</span>
                    </div>

                    {cat.isCustom && (
                      <button 
                        onClick={() => deleteCategory(cat.id)}
                        className="text-rose-500 hover:text-rose-600 p-1 hover:bg-rose-500/10 rounded"
                        title="Delete custom category"
                      >
                        <Icon name="Trash2" size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </GlassPanel>
      )}

      {/* Filter Options Panel */}
      <GlassPanel className="p-4 grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
        {/* Search */}
        <div className="relative">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search notes, categories..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 dark:border-white/5 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-emerald"
          />
        </div>

        {/* Type Filter */}
        <div>
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 dark:border-white/5 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="income">Income (+)</option>
            <option value="expense">Expenses (-)</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 dark:border-white/5 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald cursor-pointer"
          >
            <option value="all">All Categories</option>
            {/* Standard preseeded categories + customs */}
            {categories.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Sort order */}
        <div>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 dark:border-white/5 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald cursor-pointer"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>
        </div>
      </GlassPanel>

      {/* Ledger Table */}
      <GlassPanel className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-300/20 dark:border-white/5 bg-slate-100 dark:bg-navy-dark/40 text-slate-500 text-xs uppercase tracking-wider">
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Notes</th>
                <th className="py-4 px-6">Method</th>
                <th className="py-4 px-6 text-right">Amount</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300/20 dark:divide-white/5 text-sm">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map(t => (
                  <tr key={t.id} className="hover:bg-slate-100/40 dark:hover:bg-navy-dark/20 transition-colors">
                    <td className="py-4 px-6 whitespace-nowrap font-medium">{t.date}</td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="inline-flex items-center space-x-1.5 bg-slate-200/50 dark:bg-navy-light text-slate-800 dark:text-white px-2.5 py-1 rounded-full text-xs font-semibold border border-slate-300/30 dark:border-white/5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald" />
                        <span>{t.category}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-400 max-w-[200px] truncate">{t.notes || '—'}</td>
                    <td className="py-4 px-6 text-slate-500 font-mono text-xs">{t.paymentMethod}</td>
                    <td className={`py-4 px-6 text-right font-bold whitespace-nowrap ${t.type === 'income' ? 'text-emerald' : 'text-slate-800 dark:text-white'}`}>
                      {t.type === 'income' ? '+' : '-'}{formatIndianRupees(t.amount, currency)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center space-x-2">
                        <button 
                          onClick={() => handleOpenEditModal(t)}
                          className="text-slate-400 hover:text-emerald p-1.5 hover:bg-emerald/10 rounded transition-colors"
                          title="Edit Transaction"
                        >
                          <Icon name="Edit2" size={14} />
                        </button>
                        <button 
                          onClick={() => deleteTransaction(t.id)}
                          className="text-slate-400 hover:text-rose-500 p-1.5 hover:bg-rose-500/10 rounded transition-colors"
                          title="Delete Transaction"
                        >
                          <Icon name="Trash2" size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">
                    No transactions match your filters. Click "Add Transaction" to create a new record.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassPanel>

      {/* Transaction Modal (Add / Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <GlassPanel className="w-full max-w-md border-emerald/20 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">{editingTx ? 'Edit Transaction' : 'Add Transaction'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-200">
                <Icon name="X" size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitTx} className="space-y-4">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-navy-dark p-1 rounded-xl border border-slate-300/20 dark:border-white/5">
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={`py-2 rounded-lg text-sm font-semibold transition-all ${
                    type === 'expense' 
                      ? 'bg-rose-500 text-white' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={`py-2 rounded-lg text-sm font-semibold transition-all ${
                    type === 'income' 
                      ? 'bg-emerald text-white' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Income
                </button>
              </div>

              {/* Amount */}
              <div className="space-y-1">
                <label className="text-xs text-slate-500">Amount ({currency})</label>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="₹ Amount"
                  className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 dark:border-white/5 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald"
                  required
                  min="1"
                />
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-xs text-slate-500">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 dark:border-white/5 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald cursor-pointer"
                >
                  {type === 'income' ? (
                    <>
                      <option value="Salary">Salary</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Investments">Investments</option>
                      <option value="Others">Others</option>
                    </>
                  ) : (
                    categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))
                  )}
                </select>
              </div>

              {/* Date */}
              <div className="space-y-1">
                <label className="text-xs text-slate-500">Transaction Date</label>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 dark:border-white/5 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald"
                  required
                />
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-xs text-slate-500">Notes / Remarks</label>
                <input 
                  type="text" 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Weekly grocery billing"
                  className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 dark:border-white/5 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald"
                />
              </div>

              {/* Payment Method */}
              <div className="space-y-1">
                <label className="text-xs text-slate-500">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 dark:border-white/5 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald cursor-pointer"
                >
                  <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Net Banking">Net Banking / IMPS</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>

              <div className="pt-2 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white py-2 rounded-xl text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-emerald text-white py-2 rounded-xl text-sm font-semibold hover:bg-emerald-dark transition-all"
                >
                  {editingTx ? 'Update Record' : 'Create Record'}
                </button>
              </div>
            </form>
          </GlassPanel>
        </div>
      )}
    </div>
  );
};

export default ExpenseTracker;
