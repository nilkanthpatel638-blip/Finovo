import React, { useContext } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { GlassPanel } from '../components/GlassPanel';
import { Icon } from '../components/Icon';
import { formatIndianRupees } from '../utils/financeUtils';

export const Home = () => {
  const { setActivePage, theme } = useContext(FinanceContext);

  return (
    <div className="relative min-h-screen overflow-hidden py-10 px-4 md:px-8">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gold-500/5 blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-8 md:pt-16 pb-20">
        <div className="lg:col-span-7 space-y-8 text-left">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 text-emerald-500 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide border border-emerald-500/20">
            <Icon name="Shield" size={16} />
            <span>Premium Personal Finance for India</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-none">
            Take Control of Your Money with <span className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-gold text-transparent bg-clip-text">Smart Budgeting</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
            Track expenses, create dynamic budgets, monitor stock & mutual fund investments, and achieve your savings goals—all in one intelligent, glassmorphic dashboard.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              onClick={() => setActivePage('dashboard')}
              className="bg-emerald text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:bg-emerald-dark hover:shadow-emerald-500/20 hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <span>Explore Dashboard</span>
              <Icon name="ArrowRight" size={18} />
            </button>
            <button 
              onClick={() => setActivePage('calculators')}
              className="bg-slate-200 dark:bg-navy-light text-slate-800 dark:text-white px-8 py-4 rounded-xl font-semibold hover:bg-slate-300 dark:hover:bg-slate-800 transition-all duration-200 flex items-center justify-center space-x-2 border border-slate-300/50 dark:border-white/10"
            >
              <Icon name="Calculator" size={18} className="text-emerald" />
              <span>Financial Calculators</span>
            </button>
          </div>

          <div className="flex items-center space-x-8 pt-6 border-t border-slate-300/30 dark:border-white/5">
            <div>
              <span className="block text-2xl font-bold">10+</span>
              <span className="text-sm text-slate-500">Calculators</span>
            </div>
            <div className="w-px h-8 bg-slate-300/30 dark:bg-white/10" />
            <div>
              <span className="block text-2xl font-bold">₹10L+</span>
              <span className="text-sm text-slate-500">Wealth Managed</span>
            </div>
            <div className="w-px h-8 bg-slate-300/30 dark:bg-white/10" />
            <div>
              <span className="block text-2xl font-bold">0%</span>
              <span className="text-sm text-slate-500">Data Sharing</span>
            </div>
          </div>
        </div>

        {/* Hero Visual Mockup */}
        <div className="lg:col-span-5 relative">
          <div className="absolute inset-0 bg-emerald-500/10 rounded-3xl blur-3xl pointer-events-none" />
          <GlassPanel className="p-6 relative border border-white/20 dark:border-white/5 glow-emerald shadow-2xl scale-[0.98] md:scale-100">
            {/* Header Mockup */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-xs text-slate-500 font-mono">finovo.in/dashboard</span>
            </div>

            {/* Income and Expenses Mockup */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-100/50 dark:bg-navy-dark/50 p-4 rounded-xl border border-white/20 dark:border-white/5">
                <span className="text-xs text-slate-500 block mb-1">Monthly Income</span>
                <span className="text-xl font-bold text-emerald">{formatIndianRupees(85000)}</span>
                <div className="text-xs text-emerald-500 flex items-center mt-1">
                  <Icon name="ArrowUpRight" size={12} className="mr-0.5" />
                  <span>+12.4% vs last mo.</span>
                </div>
              </div>
              <div className="bg-slate-100/50 dark:bg-navy-dark/50 p-4 rounded-xl border border-white/20 dark:border-white/5">
                <span className="text-xs text-slate-500 block mb-1">Expenses</span>
                <span className="text-xl font-bold text-rose-500">{formatIndianRupees(52400)}</span>
                <div className="text-xs text-rose-500 flex items-center mt-1">
                  <Icon name="ArrowDownRight" size={12} className="mr-0.5" />
                  <span>-4.2% vs last mo.</span>
                </div>
              </div>
            </div>

            {/* Chart Graphic Mockup */}
            <div className="bg-slate-100/30 dark:bg-navy-dark/30 p-4 rounded-xl border border-white/20 dark:border-white/5 mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold">Savings Growth</span>
                <span className="text-[10px] bg-gold/20 text-gold-dark dark:text-gold px-2 py-0.5 rounded-full font-bold">Gold Class</span>
              </div>
              <div className="h-24 flex items-end justify-between px-2 pt-4">
                <div className="w-8 bg-slate-300 dark:bg-slate-800 rounded-t h-[40%]" />
                <div className="w-8 bg-slate-300 dark:bg-slate-800 rounded-t h-[55%]" />
                <div className="w-8 bg-slate-300 dark:bg-slate-800 rounded-t h-[50%]" />
                <div className="w-8 bg-emerald-500 rounded-t h-[75%] relative">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold bg-navy dark:bg-white text-white dark:text-navy px-1.5 py-0.5 rounded">₹32K</div>
                </div>
              </div>
            </div>

            {/* Savings Goals Circular Mockup */}
            <div className="flex items-center justify-between p-4 bg-slate-100/50 dark:bg-navy-dark/50 rounded-xl border border-white/20 dark:border-white/5">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gold/15 text-gold rounded-lg">
                  <Icon name="Home" size={18} />
                </div>
                <div>
                  <span className="text-xs font-semibold block">House downpayment</span>
                  <span className="text-[10px] text-slate-500">₹4.50L Saved of ₹15L</span>
                </div>
              </div>
              <div className="relative w-10 h-10 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="20" cy="20" r="16" stroke="rgba(156, 163, 175, 0.1)" strokeWidth="3.5" fill="transparent" />
                  <circle cx="20" cy="20" r="16" stroke="#F4B400" strokeWidth="3.5" fill="transparent" strokeDasharray="100.48" strokeDashoffset="70.33" />
                </svg>
                <span className="absolute text-[9px] font-bold text-gold">30%</span>
              </div>
            </div>
          </GlassPanel>
        </div>
      </div>

      {/* Feature Section */}
      <div className="max-w-7xl mx-auto py-16 border-t border-slate-300/20 dark:border-white/5">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold">Why Indian Investors Choose Finovo</h2>
          <p className="text-slate-500 max-w-xl mx-auto">Everything you need to track budget, expenses, investments, tax, and goals in one unified portal.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <GlassPanel hoverEffect className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald/15 text-emerald flex items-center justify-center mb-2">
              <Icon name="TrendingUp" size={24} />
            </div>
            <h3 className="text-lg font-bold">Asset Allocation</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Track mutual funds, shares, ETFs, gold, bank deposits, PPF, and crypto. Monitor allocation breakdowns dynamically.</p>
          </GlassPanel>

          <GlassPanel hoverEffect className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-gold/15 text-gold flex items-center justify-center mb-2">
              <Icon name="Target" size={24} />
            </div>
            <h3 className="text-lg font-bold">Unlimited Savings Goals</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Plan downpayments, vacation costs, wedding expenses, and retirement corpuses with interactive timeline tracking.</p>
          </GlassPanel>

          <GlassPanel hoverEffect className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-2">
              <Icon name="Calculator" size={24} />
            </div>
            <h3 className="text-lg font-bold">10 Indian Calculators</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Perform calculations for SIPs, EMIs, compound interest, retirement targets, inflation impacts, and compare tax regimes instantly.</p>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
};

export default Home;
