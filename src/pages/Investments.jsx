import React, { useContext, useState } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { GlassPanel } from '../components/GlassPanel';
import { Icon } from '../components/Icon';
import { formatIndianRupees } from '../utils/financeUtils';

export const Investments = () => {
  const { investments, addInvestment, deleteInvestment, currency } = useContext(FinanceContext);
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invType, setInvType] = useState('Mutual Funds');
  const [invName, setInvName] = useState('');
  const [investedAmount, setInvestedAmount] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [sipAmount, setSipAmount] = useState('');

  // Calculate overall metrics
  const totalInvested = investments.reduce((acc, curr) => acc + curr.investedAmount, 0);
  const totalCurrent = investments.reduce((acc, curr) => acc + curr.currentValue, 0);
  const totalProfit = totalCurrent - totalInvested;
  const profitPercentage = totalInvested > 0 ? Math.round((totalProfit / totalInvested) * 1000) / 10 : 0;
  const totalSIP = investments.reduce((acc, curr) => acc + (curr.sipAmount || 0), 0);

  // Group by Asset Type for allocation summary
  const allocationSummary = {};
  investments.forEach(item => {
    allocationSummary[item.type] = (allocationSummary[item.type] || 0) + item.currentValue;
  });

  const allocationList = Object.keys(allocationSummary).map(type => ({
    type,
    value: allocationSummary[type],
    percentage: totalCurrent > 0 ? Math.round((allocationSummary[type] / totalCurrent) * 100) : 0
  })).sort((a, b) => b.value - a.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!invName || !investedAmount || !currentValue) return;

    addInvestment({
      type: invType,
      name: invName,
      investedAmount: Number(investedAmount),
      currentValue: Number(currentValue),
      sipAmount: Number(sipAmount) || 0
    });

    setIsModalOpen(false);
    setInvName('');
    setInvestedAmount('');
    setCurrentValue('');
    setSipAmount('');
  };

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Investments Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">Track mutual funds, equity shares, pension accounts, and SIP commitments.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald text-white hover:bg-emerald-dark hover:scale-[1.02] shadow-lg transition-all"
        >
          <Icon name="Plus" size={16} />
          <span>Add Investment Holding</span>
        </button>
      </div>

      {/* Aggregate Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GlassPanel hoverEffect className="space-y-2">
          <span className="text-xs text-slate-500 font-semibold block uppercase tracking-wider">Current Portfolio Value</span>
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">{formatIndianRupees(totalCurrent, currency)}</h2>
          <span className="text-[10px] text-slate-400">Net asset valuation</span>
        </GlassPanel>

        <GlassPanel hoverEffect className="space-y-2">
          <span className="text-xs text-slate-500 font-semibold block uppercase tracking-wider">Invested Capital</span>
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">{formatIndianRupees(totalInvested, currency)}</h2>
          <span className="text-[10px] text-slate-400">Principal outlay capital</span>
        </GlassPanel>

        <GlassPanel hoverEffect className="space-y-2">
          <span className="text-xs text-slate-500 font-semibold block uppercase tracking-wider">Net Absolute Gains</span>
          <h2 className={`text-3xl font-extrabold ${totalProfit >= 0 ? 'text-emerald' : 'text-rose-500'}`}>
            {totalProfit >= 0 ? '+' : ''}{formatIndianRupees(totalProfit, currency)}
          </h2>
          <span className={`text-xs font-bold flex items-center ${totalProfit >= 0 ? 'text-emerald' : 'text-rose-500'}`}>
            <Icon name={totalProfit >= 0 ? 'ArrowUpRight' : 'ArrowDownRight'} size={12} className="mr-0.5" />
            {profitPercentage}% ROI
          </span>
        </GlassPanel>

        <GlassPanel hoverEffect className="space-y-2">
          <span className="text-xs text-slate-500 font-semibold block uppercase tracking-wider">Monthly SIP Outflow</span>
          <h2 className="text-3xl font-extrabold text-gold">{formatIndianRupees(totalSIP, currency)}</h2>
          <span className="text-[10px] text-slate-400">Automated SIP obligations</span>
        </GlassPanel>
      </div>

      {/* Asset Allocation & Holdings Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Asset Allocation Panel */}
        <GlassPanel className="lg:col-span-4 space-y-6">
          <h3 className="text-lg font-bold">Asset Allocation</h3>
          
          <div className="space-y-4">
            {allocationList.map(item => (
              <div key={item.type} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span>{item.type}</span>
                  <span className="text-slate-400">{item.percentage}%</span>
                </div>
                
                {/* SVG/CSS Progress allocations */}
                <div className="w-full bg-slate-200 dark:bg-navy-light h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-300"
                    style={{ 
                      width: `${item.percentage}%`,
                      backgroundColor: item.type === 'Mutual Funds' ? '#10B981' : 
                                       item.type === 'Stocks' ? '#3B82F6' : 
                                       item.type === 'Gold' ? '#F4B400' : 
                                       item.type === 'Crypto' ? '#EC4899' : '#8B5CF6'
                    }}
                  />
                </div>
                
                <span className="text-[10px] text-slate-500 block">
                  Value: {formatIndianRupees(item.value, currency)}
                </span>
              </div>
            ))}

            {investments.length === 0 && (
              <span className="text-xs text-slate-500 block text-center py-6">
                No investment assets. Click "Add Investment" to seed portfolio.
              </span>
            )}
          </div>
        </GlassPanel>

        {/* Holdings Table */}
        <GlassPanel className="lg:col-span-8 p-0 overflow-hidden">
          <div className="p-6 pb-2">
            <h3 className="text-lg font-bold">Portfolio Holdings</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-300/20 dark:border-white/5 bg-slate-100 dark:bg-navy-dark/40 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Asset Class</th>
                  <th className="py-4 px-6 text-right">Invested</th>
                  <th className="py-4 px-6 text-right">Current Value</th>
                  <th className="py-4 px-6 text-right">SIP amount</th>
                  <th className="py-4 px-6 text-center">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300/20 dark:divide-white/5 text-sm">
                {investments.map(item => {
                  const gain = item.currentValue - item.investedAmount;
                  const isGain = gain >= 0;
                  
                  return (
                    <tr key={item.id} className="hover:bg-slate-100/40 dark:hover:bg-navy-dark/20 transition-colors">
                      <td className="py-4 px-6 font-semibold whitespace-nowrap">{item.name}</td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold border border-slate-300/25 dark:border-white/5 bg-slate-200/50 dark:bg-navy-light text-slate-800 dark:text-white">
                          {item.type}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right whitespace-nowrap font-mono">{formatIndianRupees(item.investedAmount, currency)}</td>
                      <td className="py-4 px-6 text-right whitespace-nowrap font-mono">
                        <span className="block font-bold">{formatIndianRupees(item.currentValue, currency)}</span>
                        <span className={`text-[10px] font-bold ${isGain ? 'text-emerald' : 'text-rose-500'}`}>
                          {isGain ? '+' : ''}{formatIndianRupees(gain, currency)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right whitespace-nowrap font-mono font-semibold text-gold">
                        {item.sipAmount > 0 ? formatIndianRupees(item.sipAmount, currency) : '—'}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => deleteInvestment(item.id)}
                          className="text-slate-400 hover:text-rose-500 p-1.5 hover:bg-rose-500/10 rounded transition-colors"
                          title="Delete holding"
                        >
                          <Icon name="Trash2" size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassPanel>
      </div>

      {/* Add Holding Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <GlassPanel className="w-full max-w-md border-emerald/20 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Add Portfolio Asset</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-200">
                <Icon name="X" size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Asset Class Selector */}
              <div className="space-y-1">
                <label className="text-xs text-slate-500">Asset Class</label>
                <select
                  value={invType}
                  onChange={(e) => setInvType(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 dark:border-white/5 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald cursor-pointer"
                >
                  <option value="Mutual Funds">Mutual Funds</option>
                  <option value="Stocks">Equity Stocks</option>
                  <option value="ETFs">Exchange Traded Funds (ETFs)</option>
                  <option value="Gold">Sovereign Gold / Digital Gold</option>
                  <option value="Fixed Deposits">Fixed Deposits (FD)</option>
                  <option value="PPF">Public Provident Fund (PPF)</option>
                  <option value="EPF">Employee Provident Fund (EPF)</option>
                  <option value="NPS">National Pension System (NPS)</option>
                  <option value="Crypto">Crypto Assets</option>
                </select>
              </div>

              {/* Holding Name */}
              <div className="space-y-1">
                <label className="text-xs text-slate-500">Holding Name</label>
                <input 
                  type="text" 
                  value={invName}
                  onChange={(e) => setInvName(e.target.value)}
                  placeholder="e.g. Parag Parikh Flexi Cap Fund"
                  className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 dark:border-white/5 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald"
                  required
                />
              </div>

              {/* Invested Principal */}
              <div className="space-y-1">
                <label className="text-xs text-slate-500">Principal Invested Capital ({currency})</label>
                <input 
                  type="number" 
                  value={investedAmount}
                  onChange={(e) => setInvestedAmount(e.target.value)}
                  placeholder="₹ Invested"
                  className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 dark:border-white/5 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald"
                  required
                  min="1"
                />
              </div>

              {/* Current Value */}
              <div className="space-y-1">
                <label className="text-xs text-slate-500">Current Valuation ({currency})</label>
                <input 
                  type="number" 
                  value={currentValue}
                  onChange={(e) => setCurrentValue(e.target.value)}
                  placeholder="₹ Valuation"
                  className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 dark:border-white/5 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald"
                  required
                  min="1"
                />
              </div>

              {/* Monthly SIP Amount */}
              <div className="space-y-1">
                <label className="text-xs text-slate-500">Monthly SIP Commitments (Optional)</label>
                <input 
                  type="number" 
                  value={sipAmount}
                  onChange={(e) => setSipAmount(e.target.value)}
                  placeholder="₹ Monthly SIP contribution"
                  className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 dark:border-white/5 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald"
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
                  Add Holding
                </button>
              </div>
            </form>
          </GlassPanel>
        </div>
      )}
    </div>
  );
};

export default Investments;
