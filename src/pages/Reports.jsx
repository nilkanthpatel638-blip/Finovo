import React, { useContext, useState } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { GlassPanel } from '../components/GlassPanel';
import { Icon } from '../components/Icon';
import { formatIndianRupees } from '../utils/financeUtils';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  CartesianGrid
} from 'recharts';

export const Reports = () => {
  const { transactions, budgets, investments, currency, startingBalance } = useContext(FinanceContext);
  const [activeReportTab, setActiveReportTab] = useState('all');

  // 1. Data Processing for Category Breakdown (June 2026)
  const categorySummaryMap = {};
  transactions
    .filter(t => t.type === 'expense' && t.date.startsWith('2026-06'))
    .forEach(t => {
      categorySummaryMap[t.category] = (categorySummaryMap[t.category] || 0) + t.amount;
    });

  const COLORS = ['#10B981', '#3B82F6', '#EF4444', '#F59E0B', '#EC4899', '#8B5CF6', '#6366F1', '#14B8A6', '#06B6D4', '#64748B', '#FBBF24', '#059669'];
  const pieData = Object.keys(categorySummaryMap).map((cat, i) => ({
    name: cat,
    value: categorySummaryMap[cat],
    color: COLORS[i % COLORS.length]
  })).sort((a, b) => b.value - a.value);

  // 2. Data Processing for Income vs Expenses (Dynamic month grouping)
  const monthlyDataMap = {};
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
  
  transactions.forEach(t => {
    const dateObj = new Date(t.date);
    if (isNaN(dateObj.getTime())) return;
    const monthStr = monthNames[dateObj.getMonth()];
    const year = dateObj.getFullYear();
    const key = `${monthStr} ${year}`;
    
    if (!monthlyDataMap[key]) {
      monthlyDataMap[key] = { month: key, Income: 0, Expenses: 0, sortKey: dateObj.getTime() };
    }
    
    if (t.type === 'income') {
      monthlyDataMap[key].Income += t.amount;
    } else if (t.type === 'expense') {
      monthlyDataMap[key].Expenses += t.amount;
    }
  });

  const barData = Object.values(monthlyDataMap)
    .sort((a, b) => a.sortKey - b.sortKey)
    .map(d => ({
      month: d.month,
      Income: d.Income,
      Expenses: d.Expenses,
      Savings: Math.max(0, d.Income - d.Expenses)
    }));

  if (barData.length === 0) {
    const curDate = new Date();
    const curMonthKey = `${monthNames[curDate.getMonth()]} ${curDate.getFullYear()}`;
    barData.push({
      month: curMonthKey,
      Income: 0,
      Expenses: 0,
      Savings: 0
    });
  }

  // 3. Data Processing for Cash Flow Area Chart (accumulated net cash flow)
  let cumulative = startingBalance;
  const areaData = barData.map(d => {
    cumulative += (d.Income - d.Expenses);
    return {
      month: d.month,
      Balance: cumulative
    };
  });

  // Custom tooltips to match our premium theme
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-navy-dark/95 border border-white/10 p-3 rounded-xl shadow-xl text-xs space-y-1">
          <p className="font-bold text-white mb-1">{label}</p>
          {payload.map((p, idx) => (
            <p key={idx} style={{ color: p.color || p.payload.color || '#34D399' }} className="font-semibold">
              {p.name}: {formatIndianRupees(p.value, currency)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Reports & Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400">Examine spending clusters, savings progressions, and asset breakdowns.</p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-slate-100 dark:bg-navy-dark p-1 rounded-xl border border-slate-300/20 dark:border-white/5">
          {['all', 'expenses', 'cashflow'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveReportTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${
                activeReportTab === tab 
                  ? 'bg-emerald text-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab === 'all' ? 'Unified Overview' : `${tab} detail`}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Income vs Expenses Bar Chart */}
        {(activeReportTab === 'all' || activeReportTab === 'cashflow') && (
          <GlassPanel className="space-y-4 h-[380px]">
            <h3 className="text-base font-bold flex items-center space-x-2">
              <Icon name="ArrowUpRight" className="text-emerald" />
              <span>Income vs Expenses Trends (H1 2026)</span>
            </h3>
            
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="Income" fill="#10B981" radius={[4, 4, 0, 0]} name="Income" />
                  <Bar dataKey="Expenses" fill="#EF4444" radius={[4, 4, 0, 0]} name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassPanel>
        )}

        {/* Category Breakdown Pie Chart */}
        {(activeReportTab === 'all' || activeReportTab === 'expenses') && (
          <GlassPanel className="space-y-4 h-[380px]">
            <h3 className="text-base font-bold flex items-center space-x-2">
              <Icon name="PieChart" className="text-gold" />
              <span>Expense Categories Allocation (June)</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-72 items-center">
              {/* Pie diagram */}
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip content={<CustomTooltip />} />
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legends lists */}
              <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                {pieData.map((entry, index) => (
                  <div key={index} className="flex justify-between items-center text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="font-medium">{entry.name}</span>
                    </div>
                    <span className="font-bold">{formatIndianRupees(entry.value, currency)}</span>
                  </div>
                ))}
                
                {pieData.length === 0 && (
                  <span className="text-xs text-slate-500 block text-center py-10">No expenses logged.</span>
                )}
              </div>
            </div>
          </GlassPanel>
        )}

        {/* Net Worth / Cash Flow Accumulation Area Chart */}
        {(activeReportTab === 'all' || activeReportTab === 'cashflow') && (
          <GlassPanel className="space-y-4 h-[380px]">
            <h3 className="text-base font-bold flex items-center space-x-2">
              <Icon name="TrendingUp" className="text-blue-500" />
              <span>Net Wealth Cumulative Growth</span>
            </h3>
            
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={areaData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorBal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="Balance" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorBal)" name="Net Balance" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassPanel>
        )}

        {/* Savings Rate Trends Line Chart */}
        {(activeReportTab === 'all' || activeReportTab === 'expenses') && (
          <GlassPanel className="space-y-4 h-[380px]">
            <h3 className="text-base font-bold flex items-center space-x-2">
              <Icon name="Activity" className="text-pink-500" />
              <span>Monthly Savings Trends</span>
            </h3>
            
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="Savings" stroke="#F4B400" strokeWidth={2.5} activeDot={{ r: 6 }} name="Liquid Savings" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassPanel>
        )}

      </div>
    </div>
  );
};

export default Reports;
