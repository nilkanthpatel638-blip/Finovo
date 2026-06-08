import React, { useContext, useState } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { GlassPanel } from '../components/GlassPanel';
import { Icon } from '../components/Icon';
import { formatIndianRupees } from '../utils/financeUtils';

export const Goals = () => {
  const { goals, addGoal, deleteGoal, updateGoalProgress, currency } = useContext(FinanceContext);
  
  // Modals / forms state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  
  // Goal Form State
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [savedAmount, setSavedAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [goalIcon, setGoalIcon] = useState('Target');

  // Deposit Form State
  const [depositValue, setDepositValue] = useState('');

  const GOAL_ICONS = ['Target', 'Home', 'Car', 'Plane', 'GraduationCap', 'Heart', 'Shield', 'Gift', 'Gem', 'Briefcase'];

  const handleSubmitGoal = (e) => {
    e.preventDefault();
    if (!goalName || !targetAmount || !deadline) return;

    addGoal({
      name: goalName,
      targetAmount: Number(targetAmount),
      savedAmount: Number(savedAmount) || 0,
      deadline,
      monthlyContribution: Number(monthlyContribution) || 0,
      icon: goalIcon
    });

    setIsModalOpen(false);
    resetGoalForm();
  };

  const resetGoalForm = () => {
    setGoalName('');
    setTargetAmount('');
    setSavedAmount('');
    setDeadline('');
    setMonthlyContribution('');
    setGoalIcon('Target');
  };

  const handleDepositSubmit = (e) => {
    e.preventDefault();
    if (!depositValue || isNaN(Number(depositValue)) || !selectedGoal) return;

    updateGoalProgress(selectedGoal.id, Number(depositValue));
    setIsDepositOpen(false);
    setDepositValue('');
    setSelectedGoal(null);
  };

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Savings Goals</h1>
          <p className="text-slate-500 dark:text-slate-400">Set targets for major lifecycle expenses and track your accumulation timeline.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald text-white hover:bg-emerald-dark hover:scale-[1.02] shadow-lg transition-all"
        >
          <Icon name="Plus" size={16} />
          <span>Create Savings Goal</span>
        </button>
      </div>

      {/* Grid of Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map(g => {
          const percent = Math.min(100, Math.round((g.savedAmount / g.targetAmount) * 100));
          const remainingAmount = Math.max(0, g.targetAmount - g.savedAmount);
          
          // SVG calculations for circular progress bar
          const radius = 50;
          const strokeWidth = 8;
          const circumference = 2 * Math.PI * radius; // ~314.16
          const strokeDashoffset = circumference - (percent / 100) * circumference;

          return (
            <GlassPanel key={g.id} hoverEffect className="flex flex-col justify-between space-y-4 h-full relative">
              {/* Card Upper */}
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gold/15 text-gold rounded-xl">
                    <Icon name={g.icon || 'Target'} size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">{g.name}</h3>
                    <span className="text-[10px] font-mono text-slate-500">Deadline: {g.deadline}</span>
                  </div>
                </div>

                <button 
                  onClick={() => deleteGoal(g.id)}
                  className="text-slate-400 hover:text-rose-500 p-1.5 hover:bg-rose-500/10 rounded transition-colors"
                  title="Delete Goal"
                >
                  <Icon name="Trash2" size={14} />
                </button>
              </div>

              {/* Progress and SVG circular graphic */}
              <div className="flex items-center justify-between py-2">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Target Corpus</span>
                  <span className="text-xl font-extrabold">{formatIndianRupees(g.targetAmount, currency)}</span>
                  
                  <div className="text-[10px] text-slate-400 pt-1">
                    <span className="font-semibold text-emerald">{formatIndianRupees(g.savedAmount, currency)}</span> Saved
                  </div>
                </div>

                {/* SVG Circle */}
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle 
                      cx="48" 
                      cy="48" 
                      r={radius} 
                      stroke="rgba(156, 163, 175, 0.1)" 
                      strokeWidth={strokeWidth} 
                      fill="transparent" 
                    />
                    <circle 
                      cx="48" 
                      cy="48" 
                      r={radius} 
                      stroke="#F4B400" 
                      strokeWidth={strokeWidth} 
                      fill="transparent" 
                      strokeDasharray={circumference} 
                      strokeDashoffset={strokeDashoffset}
                      className="circular-progress-bar"
                    />
                  </svg>
                  <span className="absolute text-sm font-extrabold text-gold">{percent}%</span>
                </div>
              </div>

              {/* Deadline & monthly specs */}
              <div className="text-xs space-y-2 py-2 border-t border-slate-300/15 dark:border-white/5">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-500">Monthly Contribution</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {g.monthlyContribution > 0 ? `${formatIndianRupees(g.monthlyContribution, currency)}/mo` : '—'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-500">Remaining Corpus</span>
                  <span className="font-semibold text-rose-500">{formatIndianRupees(remainingAmount, currency)}</span>
                </div>
              </div>

              {/* Deposit Buttons */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    setSelectedGoal(g);
                    setIsDepositOpen(true);
                  }}
                  className="w-full bg-emerald hover:bg-emerald-dark text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md"
                >
                  <Icon name="Plus" size={12} />
                  <span>Log Goal Savings</span>
                </button>
              </div>
            </GlassPanel>
          );
        })}
      </div>

      {/* Goal creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <GlassPanel className="w-full max-w-md border-emerald/20 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">New Savings Goal</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-200">
                <Icon name="X" size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitGoal} className="space-y-4">
              {/* Icon Selection */}
              <div className="space-y-1">
                <label className="text-xs text-slate-500 block">Goal Icon</label>
                <div className="flex gap-2 flex-wrap p-2 bg-slate-100 dark:bg-navy-dark/40 rounded-xl border border-slate-300/20 dark:border-white/5">
                  {GOAL_ICONS.map(ic => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setGoalIcon(ic)}
                      className={`p-2 rounded-lg border transition-all ${
                        goalIcon === ic 
                          ? 'bg-gold/25 border-gold text-gold' 
                          : 'border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Icon name={ic} size={16} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Goal Name */}
              <div className="space-y-1">
                <label className="text-xs text-slate-500">Goal Name</label>
                <input 
                  type="text" 
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  placeholder="e.g. Wedding Fund, Car Capital"
                  className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 dark:border-white/5 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald"
                  required
                />
              </div>

              {/* Target Amount */}
              <div className="space-y-1">
                <label className="text-xs text-slate-500">Target Savings ({currency})</label>
                <input 
                  type="number" 
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  placeholder="₹ Corpus Target"
                  className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 dark:border-white/5 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald"
                  required
                  min="1"
                />
              </div>

              {/* Preseeded Savings */}
              <div className="space-y-1">
                <label className="text-xs text-slate-500">Initial Savings Saved (Optional)</label>
                <input 
                  type="number" 
                  value={savedAmount}
                  onChange={(e) => setSavedAmount(e.target.value)}
                  placeholder="₹ Amount currently saved"
                  className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 dark:border-white/5 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald"
                />
              </div>

              {/* Monthly contribution */}
              <div className="space-y-1">
                <label className="text-xs text-slate-500">Target Monthly Contribution (Optional)</label>
                <input 
                  type="number" 
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(e.target.value)}
                  placeholder="₹ Saved per month"
                  className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 dark:border-white/5 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald"
                />
              </div>

              {/* Deadline */}
              <div className="space-y-1">
                <label className="text-xs text-slate-500">Deadline Target Date</label>
                <input 
                  type="date" 
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 dark:border-white/5 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald"
                  required
                />
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
                  Create Goal
                </button>
              </div>
            </form>
          </GlassPanel>
        </div>
      )}

      {/* Log Savings Deposit Modal */}
      {isDepositOpen && selectedGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <GlassPanel className="w-full max-w-sm border-gold/20 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Log Savings</h3>
              <button 
                onClick={() => {
                  setIsDepositOpen(false);
                  setSelectedGoal(null);
                }} 
                className="text-slate-500 hover:text-slate-200"
              >
                <Icon name="X" size={18} />
              </button>
            </div>

            <form onSubmit={handleDepositSubmit} className="space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Log money added to your <span className="font-semibold text-slate-700 dark:text-white">"{selectedGoal.name}"</span> savings goal.
              </p>

              <div className="space-y-1">
                <label className="text-xs text-slate-500">Savings Amount ({currency})</label>
                <input 
                  type="number" 
                  value={depositValue}
                  onChange={(e) => setDepositValue(e.target.value)}
                  placeholder="₹ Contribution amount"
                  className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 dark:border-white/5 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-gold"
                  required
                  min="1"
                />
              </div>

              <div className="pt-2 flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsDepositOpen(false);
                    setSelectedGoal(null);
                  }}
                  className="w-1/2 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white py-2 rounded-xl text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-gold text-navy font-bold py-2 rounded-xl text-sm hover:bg-gold-light transition-all"
                >
                  Confirm Deposit
                </button>
              </div>
            </form>
          </GlassPanel>
        </div>
      )}
    </div>
  );
};

export default Goals;
