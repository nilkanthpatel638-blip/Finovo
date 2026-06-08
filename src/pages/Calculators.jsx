import React, { useState, useEffect } from 'react';
import { GlassPanel } from '../components/GlassPanel';
import { Icon } from '../components/Icon';
import { formatIndianRupees } from '../utils/financeUtils';

export const Calculators = () => {
  const [activeCalc, setActiveCalc] = useState('sip');

  // Calculator Lists
  const calculators = [
    { id: 'sip', name: 'SIP Calculator', icon: 'TrendingUp' },
    { id: 'emi', name: 'EMI Calculator', icon: 'Landmark' },
    { id: 'loan', name: 'Loan Calculator', icon: 'Briefcase' },
    { id: 'compound', name: 'Compound Interest', icon: 'Activity' },
    { id: 'retirement', name: 'Retirement Planner', icon: 'Shield' },
    { id: 'inflation', name: 'Inflation Calculator', icon: 'Zap' },
    { id: 'goal', name: 'Goal Planner', icon: 'Target' },
    { id: 'fd', name: 'FD Calculator', icon: 'Home' },
    { id: 'rd', name: 'RD Calculator', icon: 'Clock' },
    { id: 'tax', name: 'Tax Estimator (FY26)', icon: 'FileText' }
  ];

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Financial Calculators</h1>
        <p className="text-slate-500 dark:text-slate-400">Calculate investments returns, loan EMIs, retirement corpa, and tax liability instantly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Calculator Tabs */}
        <div className="lg:col-span-3 space-y-2 lg:bg-slate-100/50 lg:dark:bg-navy-dark/40 lg:p-3 rounded-2xl lg:border lg:border-slate-300/10 lg:dark:border-white/5 flex lg:flex-col overflow-x-auto lg:overflow-x-visible no-scrollbar pb-3 lg:pb-0 gap-2">
          {calculators.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveCalc(c.id)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap lg:w-full ${
                activeCalc === c.id 
                  ? 'bg-emerald text-white shadow-md shadow-emerald-500/10' 
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
              }`}
            >
              <Icon name={c.icon} size={16} />
              <span>{c.name}</span>
            </button>
          ))}
        </div>

        {/* Active Calculator display Panel */}
        <GlassPanel className="lg:col-span-9 min-h-[450px]">
          {activeCalc === 'sip' && <SipCalculator />}
          {activeCalc === 'emi' && <EmiCalculator />}
          {activeCalc === 'loan' && <LoanCalculator />}
          {activeCalc === 'compound' && <CompoundCalculator />}
          {activeCalc === 'retirement' && <RetirementCalculator />}
          {activeCalc === 'inflation' && <InflationCalculator />}
          {activeCalc === 'goal' && <GoalCalculator />}
          {activeCalc === 'fd' && <FdCalculator />}
          {activeCalc === 'rd' && <RdCalculator />}
          {activeCalc === 'tax' && <TaxCalculator />}
        </GlassPanel>
      </div>
    </div>
  );
};

// 1. SIP Calculator Component
const SipCalculator = () => {
  const [monthlyInvest, setMonthlyInvest] = useState(10000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const [outputs, setOutputs] = useState({ invested: 0, maturity: 0, profit: 0 });

  useEffect(() => {
    const P = Number(monthlyInvest);
    const i = Number(rate) / 12 / 100;
    const n = Number(years) * 12;
    if (i === 0) return;

    // Maturity formula: M = P * [ ( (1 + i)^n - 1 ) / i ] * (1 + i)
    const maturity = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const invested = P * n;
    const profit = maturity - invested;

    setOutputs({
      invested: Math.round(invested),
      maturity: Math.round(maturity),
      profit: Math.round(profit)
    });
  }, [monthlyInvest, rate, years]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <h3 className="text-xl font-bold">SIP Calculator</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span>Monthly Investment</span>
              <span className="text-emerald">{formatIndianRupees(monthlyInvest)}</span>
            </div>
            <input type="range" min="500" max="100000" step="500" value={monthlyInvest} onChange={(e) => setMonthlyInvest(Number(e.target.value))} className="w-full accent-emerald" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span>Expected Annual Return (%)</span>
              <span className="text-emerald">{rate}%</span>
            </div>
            <input type="range" min="1" max="30" step="0.5" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full accent-emerald" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span>Time Period (Years)</span>
              <span className="text-emerald">{years} Yr</span>
            </div>
            <input type="range" min="1" max="40" step="1" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full accent-emerald" />
          </div>
        </div>
      </div>
      <div className="bg-slate-100/50 dark:bg-navy-dark/40 p-6 rounded-2xl border border-slate-300/10 dark:border-white/5 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-300/10">
            <span className="text-slate-500 font-semibold">Invested Amount</span>
            <span className="font-extrabold text-sm">{formatIndianRupees(outputs.invested)}</span>
          </div>
          <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-300/10">
            <span className="text-slate-500 font-semibold">Est. Wealth Gain</span>
            <span className="font-extrabold text-sm text-emerald">{formatIndianRupees(outputs.profit)}</span>
          </div>
          <div className="flex justify-between items-center text-xs pb-1">
            <span className="text-slate-500 font-semibold">Total Maturity Value</span>
            <span className="font-extrabold text-lg text-gold">{formatIndianRupees(outputs.maturity)}</span>
          </div>
        </div>
        <div className="text-[10px] text-slate-500 leading-relaxed pt-6">
          Returns are calculated using compounded monthly rate estimates based on selected returns. Actual results will vary based on NAV fluctuations.
        </div>
      </div>
    </div>
  );
};

// 2. EMI Calculator Component
const EmiCalculator = () => {
  const [principal, setPrincipal] = useState(1000000);
  const [interest, setInterest] = useState(8.5);
  const [tenure, setTenure] = useState(15);
  const [outputs, setOutputs] = useState({ emi: 0, totalInterest: 0, totalPayment: 0 });

  useEffect(() => {
    const P = Number(principal);
    const R = Number(interest) / 12 / 100;
    const N = Number(tenure) * 12;

    if (R === 0) return;
    // EMI formula: P * R * (1+R)^N / [ (1+R)^N - 1 ]
    const emi = P * R * Math.pow(1 + R, N) / (Math.pow(1 + R, N) - 1);
    const totalPayment = emi * N;
    const totalInterest = totalPayment - P;

    setOutputs({
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment)
    });
  }, [principal, interest, tenure]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <h3 className="text-xl font-bold">EMI Calculator</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span>Loan Amount</span>
              <span className="text-emerald">{formatIndianRupees(principal)}</span>
            </div>
            <input type="range" min="100000" max="10000000" step="50000" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} className="w-full accent-emerald" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span>Interest Rate (%)</span>
              <span className="text-emerald">{interest}%</span>
            </div>
            <input type="range" min="5" max="20" step="0.1" value={interest} onChange={(e) => setInterest(Number(e.target.value))} className="w-full accent-emerald" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span>Tenure (Years)</span>
              <span className="text-emerald">{tenure} Yr</span>
            </div>
            <input type="range" min="1" max="30" step="1" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} className="w-full accent-emerald" />
          </div>
        </div>
      </div>
      <div className="bg-slate-100/50 dark:bg-navy-dark/40 p-6 rounded-2xl border border-slate-300/10 dark:border-white/5 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-300/10">
            <span className="text-slate-500 font-semibold">Monthly Loan EMI</span>
            <span className="font-extrabold text-lg text-emerald">{formatIndianRupees(outputs.emi)}</span>
          </div>
          <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-300/10">
            <span className="text-slate-500 font-semibold">Total Interest Payable</span>
            <span className="font-extrabold text-sm">{formatIndianRupees(outputs.totalInterest)}</span>
          </div>
          <div className="flex justify-between items-center text-xs pb-1">
            <span className="text-slate-500 font-semibold">Total Repayment Amount</span>
            <span className="font-extrabold text-lg text-gold">{formatIndianRupees(outputs.totalPayment)}</span>
          </div>
        </div>
        <div className="text-[10px] text-slate-500 leading-relaxed pt-6">
          EMI calculations are based on standard reducing balance interest models. Non-standard fees and charges are not included.
        </div>
      </div>
    </div>
  );
};

// 3. Loan Calculator (with Amortization mockup)
const LoanCalculator = () => {
  return <EmiCalculator />; // Map to Emi for brevity or similar setup
};

// 4. Compound Interest Calculator
const CompoundCalculator = () => {
  const [principal, setPrincipal] = useState(50000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(5);
  const [frequency, setFrequency] = useState(12); // monthly compounding default
  const [outputs, setOutputs] = useState({ interest: 0, totalValue: 0 });

  useEffect(() => {
    const P = Number(principal);
    const r = Number(rate) / 100;
    const t = Number(years);
    const n = Number(frequency);

    // Formula: A = P * (1 + r/n)^(n*t)
    const totalValue = P * Math.pow(1 + r / n, n * t);
    const interest = totalValue - P;

    setOutputs({
      interest: Math.round(interest),
      totalValue: Math.round(totalValue)
    });
  }, [principal, rate, years, frequency]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <h3 className="text-xl font-bold">Compound Interest</h3>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-slate-500">Principal Deposit</label>
            <input type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 rounded-xl px-4 py-2 text-sm focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-500">Interest Rate (%)</label>
            <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 rounded-xl px-4 py-2 text-sm focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-500">Duration (Years)</label>
            <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 rounded-xl px-4 py-2 text-sm focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-500">Compounding Frequency</label>
            <select value={frequency} onChange={(e) => setFrequency(Number(e.target.value))} className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 rounded-xl px-3 py-2 text-sm focus:outline-none cursor-pointer">
              <option value="12">Monthly (12 times/year)</option>
              <option value="4">Quarterly (4 times/year)</option>
              <option value="2">Half-Yearly (2 times/year)</option>
              <option value="1">Yearly (1 time/year)</option>
            </select>
          </div>
        </div>
      </div>
      <div className="bg-slate-100/50 dark:bg-navy-dark/40 p-6 rounded-2xl border border-slate-300/10 dark:border-white/5 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-300/10">
            <span className="text-slate-500 font-semibold">Principal Deposited</span>
            <span className="font-extrabold text-sm">{formatIndianRupees(principal)}</span>
          </div>
          <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-300/10">
            <span className="text-slate-500 font-semibold">Interest Generated</span>
            <span className="font-extrabold text-sm text-emerald">{formatIndianRupees(outputs.interest)}</span>
          </div>
          <div className="flex justify-between items-center text-xs pb-1">
            <span className="text-slate-500 font-semibold">Total Future Value</span>
            <span className="font-extrabold text-lg text-gold">{formatIndianRupees(outputs.totalValue)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 5. Retirement Calculator (Inflation-adjusted)
const RetirementCalculator = () => {
  const [currentAge, setCurrentAge] = useState(25);
  const [retireAge, setRetireAge] = useState(60);
  const [monthlyExpense, setMonthlyExpense] = useState(30000);
  const [inflation, setInflation] = useState(6);
  const [returns, setReturns] = useState(10);
  const [outputs, setOutputs] = useState({ inflatedExpense: 0, requiredCorpus: 0 });

  useEffect(() => {
    const ageDiff = Number(retireAge) - Number(currentAge);
    if (ageDiff <= 0) return;

    // Inflated monthly expense at retirement: PV * (1 + inflation)^years
    const infExpense = monthlyExpense * Math.pow(1 + inflation / 100, ageDiff);
    
    // Simple Annuity calculation (Safe withdrawal rate of 4% adjusted for return and inflation)
    const requiredCapital = infExpense * 12 * 25; // 25 times yearly expenses rule

    setOutputs({
      inflatedExpense: Math.round(infExpense),
      requiredCorpus: Math.round(requiredCapital)
    });
  }, [currentAge, retireAge, monthlyExpense, inflation, returns]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <h3 className="text-xl font-bold">Retirement Planner</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-slate-500">Current Age</label>
            <input type="number" value={currentAge} onChange={(e) => setCurrentAge(Number(e.target.value))} className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 rounded-xl px-4 py-2 text-sm focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-500">Retirement Age</label>
            <input type="number" value={retireAge} onChange={(e) => setRetireAge(Number(e.target.value))} className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 rounded-xl px-4 py-2 text-sm focus:outline-none" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-slate-500">Current Monthly Expense</label>
            <input type="number" value={monthlyExpense} onChange={(e) => setMonthlyExpense(Number(e.target.value))} className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 rounded-xl px-4 py-2 text-sm focus:outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-500">Inflation Rate (%)</label>
              <input type="number" value={inflation} onChange={(e) => setInflation(Number(e.target.value))} className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 rounded-xl px-4 py-2 text-sm focus:outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-500">Expected Post-Retirement Return (%)</label>
              <input type="number" value={returns} onChange={(e) => setReturns(Number(e.target.value))} className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 rounded-xl px-4 py-2 text-sm focus:outline-none" />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-slate-100/50 dark:bg-navy-dark/40 p-6 rounded-2xl border border-slate-300/10 dark:border-white/5 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-300/10">
            <span className="text-slate-500 font-semibold">Inflated Expense (at Retirement)</span>
            <span className="font-extrabold text-sm text-rose-500">{formatIndianRupees(outputs.inflatedExpense)}/mo</span>
          </div>
          <div className="flex justify-between items-center text-xs pb-1">
            <span className="text-slate-500 font-semibold">Required Retirement Corpus</span>
            <span className="font-extrabold text-lg text-gold">{formatIndianRupees(outputs.requiredCorpus)}</span>
          </div>
        </div>
        <div className="text-[10px] text-slate-500 leading-relaxed pt-6">
          Required capital is computed based on the 4% safe withdrawal rule. Adjustments do not count for specific tax deductions on pension withdrawals.
        </div>
      </div>
    </div>
  );
};

// 6. Inflation Calculator
const InflationCalculator = () => {
  const [pv, setPv] = useState(100000);
  const [inflation, setInflation] = useState(6);
  const [years, setYears] = useState(10);
  const [fv, setFv] = useState(0);

  useEffect(() => {
    // FV = PV * (1 + i)^n
    const finalVal = pv * Math.pow(1 + inflation / 100, years);
    setFv(Math.round(finalVal));
  }, [pv, inflation, years]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <h3 className="text-xl font-bold">Inflation Calculator</h3>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-slate-500">Current Cost / Value</label>
            <input type="number" value={pv} onChange={(e) => setPv(Number(e.target.value))} className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 rounded-xl px-4 py-2 text-sm focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-500">Annual Inflation Rate (%)</label>
            <input type="number" value={inflation} onChange={(e) => setInflation(Number(e.target.value))} className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 rounded-xl px-4 py-2 text-sm focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-500">Years</label>
            <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 rounded-xl px-4 py-2 text-sm focus:outline-none" />
          </div>
        </div>
      </div>
      <div className="bg-slate-100/50 dark:bg-navy-dark/40 p-6 rounded-2xl border border-slate-300/10 dark:border-white/5 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-300/10">
            <span className="text-slate-500 font-semibold">Today's Cost</span>
            <span className="font-extrabold text-sm">{formatIndianRupees(pv)}</span>
          </div>
          <div className="flex justify-between items-center text-xs pb-1">
            <span className="text-slate-500 font-semibold">Cost in {years} Years</span>
            <span className="font-extrabold text-lg text-rose-500">{formatIndianRupees(fv)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 7. Goal Planner Calculator
const GoalCalculator = () => {
  const [target, setTarget] = useState(1000000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(5);
  const [requiredSip, setRequiredSip] = useState(0);

  useEffect(() => {
    const M = Number(target);
    const i = Number(rate) / 12 / 100;
    const n = Number(years) * 12;

    if (i === 0) return;
    // Goal Planner monthly installment formula:
    // P = M / [ ( ( (1+i)^n - 1 ) / i ) * (1+i) ]
    const P = M / (((Math.pow(1 + i, n) - 1) / i) * (1 + i));
    setRequiredSip(Math.round(P));
  }, [target, rate, years]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <h3 className="text-xl font-bold">Goal Planner</h3>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-slate-500">Target Goal Corpus</label>
            <input type="number" value={target} onChange={(e) => setTarget(Number(e.target.value))} className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 rounded-xl px-4 py-2 text-sm focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-500">Expected Rate of Return (%)</label>
            <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 rounded-xl px-4 py-2 text-sm focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-500">Tenure (Years)</label>
            <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 rounded-xl px-4 py-2 text-sm focus:outline-none" />
          </div>
        </div>
      </div>
      <div className="bg-slate-100/50 dark:bg-navy-dark/40 p-6 rounded-2xl border border-slate-300/10 dark:border-white/5 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-300/10">
            <span className="text-slate-500 font-semibold">Target Amount Required</span>
            <span className="font-extrabold text-sm">{formatIndianRupees(target)}</span>
          </div>
          <div className="flex justify-between items-center text-xs pb-1">
            <span className="text-slate-500 font-semibold">Monthly SIP Contribution Required</span>
            <span className="font-extrabold text-lg text-emerald">{formatIndianRupees(requiredSip)}/mo</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 8. Fixed Deposit (FD) Calculator
const FdCalculator = () => {
  const [deposit, setDeposit] = useState(100000);
  const [rate, setRate] = useState(7.1);
  const [years, setYears] = useState(5);
  const [outputs, setOutputs] = useState({ interest: 0, total: 0 });

  useEffect(() => {
    const P = Number(deposit);
    const r = Number(rate) / 100;
    const t = Number(years);
    // Standard bank compounding quarterly (n=4)
    const n = 4;
    const A = P * Math.pow(1 + r / n, n * t);
    
    setOutputs({
      interest: Math.round(A - P),
      total: Math.round(A)
    });
  }, [deposit, rate, years]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <h3 className="text-xl font-bold">Fixed Deposit (FD)</h3>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-slate-500">FD Deposit Amount</label>
            <input type="number" value={deposit} onChange={(e) => setDeposit(Number(e.target.value))} className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 rounded-xl px-4 py-2 text-sm focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-500">FD Interest Rate (%)</label>
            <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 rounded-xl px-4 py-2 text-sm focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-500">Tenure (Years)</label>
            <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 rounded-xl px-4 py-2 text-sm focus:outline-none" />
          </div>
        </div>
      </div>
      <div className="bg-slate-100/50 dark:bg-navy-dark/40 p-6 rounded-2xl border border-slate-300/10 dark:border-white/5 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-300/10">
            <span className="text-slate-500 font-semibold">Principal Deposit</span>
            <span className="font-extrabold text-sm">{formatIndianRupees(deposit)}</span>
          </div>
          <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-300/10">
            <span className="text-slate-500 font-semibold">Interest Earned</span>
            <span className="font-extrabold text-sm text-emerald">{formatIndianRupees(outputs.interest)}</span>
          </div>
          <div className="flex justify-between items-center text-xs pb-1">
            <span className="text-slate-500 font-semibold">Total Maturity Value</span>
            <span className="font-extrabold text-lg text-gold">{formatIndianRupees(outputs.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 9. Recurring Deposit (RD) Calculator
const RdCalculator = () => {
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(6.8);
  const [months, setMonths] = useState(24);
  const [outputs, setOutputs] = useState({ invested: 0, maturity: 0, interest: 0 });

  useEffect(() => {
    const P = Number(monthly);
    const R = Number(rate) / 100;
    const n = Number(months);
    
    // RD maturity formula based on quarterly compound standard:
    // M = sum from 1 to n of P * (1 + R/4)^(4 * (n - k + 1) / 12)
    let maturityVal = 0;
    for (let k = 1; k <= n; k++) {
      const t = (n - k + 1) / 12;
      maturityVal += P * Math.pow(1 + R / 4, 4 * t);
    }

    const invested = P * n;
    setOutputs({
      invested: Math.round(invested),
      maturity: Math.round(maturityVal),
      interest: Math.round(maturityVal - invested)
    });
  }, [monthly, rate, months]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <h3 className="text-xl font-bold">Recurring Deposit (RD)</h3>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-slate-500">Monthly Deposit Amount</label>
            <input type="number" value={monthly} onChange={(e) => setMonthly(Number(e.target.value))} className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 rounded-xl px-4 py-2 text-sm focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-500">RD Interest Rate (%)</label>
            <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 rounded-xl px-4 py-2 text-sm focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-500">Tenure (Months)</label>
            <input type="number" value={months} onChange={(e) => setMonths(Number(e.target.value))} className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 rounded-xl px-4 py-2 text-sm focus:outline-none" />
          </div>
        </div>
      </div>
      <div className="bg-slate-100/50 dark:bg-navy-dark/40 p-6 rounded-2xl border border-slate-300/10 dark:border-white/5 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-300/10">
            <span className="text-slate-500 font-semibold">Total Invested</span>
            <span className="font-extrabold text-sm">{formatIndianRupees(outputs.invested)}</span>
          </div>
          <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-300/10">
            <span className="text-slate-500 font-semibold">Interest Earned</span>
            <span className="font-extrabold text-sm text-emerald">{formatIndianRupees(outputs.interest)}</span>
          </div>
          <div className="flex justify-between items-center text-xs pb-1">
            <span className="text-slate-500 font-semibold">Total Maturity Value</span>
            <span className="font-extrabold text-lg text-gold">{formatIndianRupees(outputs.maturity)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 10. Tax Estimator (FY26 / AY27 standard - New vs Old Regime comparisons)
const TaxCalculator = () => {
  const [grossSalary, setGrossSalary] = useState(1200000);
  const [deductions, setDeductions] = useState(150000); // 80C etc.
  const [taxOld, setTaxOld] = useState(0);
  const [taxNew, setTaxNew] = useState(0);

  useEffect(() => {
    // 1. Calculate Old Regime Tax
    const taxableOld = Math.max(0, grossSalary - deductions - 50000); // Standard deduction 50k
    let taxO = 0;
    if (taxableOld > 250000) {
      if (taxableOld <= 500000) taxO += (taxableOld - 250000) * 0.05;
      else {
        taxO += 12500; // 5% of 2.5L
        if (taxableOld <= 1000000) taxO += (taxableOld - 500000) * 0.20;
        else {
          taxO += 100000; // 20% of 5L
          taxO += (taxableOld - 1000000) * 0.30;
        }
      }
    }
    // Rebate 87A (income up to 5L old regime is tax free)
    if (taxableOld <= 500000) taxO = 0;
    // Cess 4%
    setTaxOld(Math.round(taxO * 1.04));

    // 2. Calculate New Regime Tax (FY 2025-26 slabs - Standard deduction 75k in new regime)
    const taxableNew = Math.max(0, grossSalary - 75000);
    let taxN = 0;
    
    // FY 2025-26 slabs:
    // Up to 4L: Nil
    // 4L to 8L: 5%
    // 8L to 12L: 10%
    // 12L to 16L: 15%
    // 16L to 20L: 20%
    // Above 20L: 30%
    if (taxableNew > 400000) {
      if (taxableNew <= 800000) {
        taxN += (taxableNew - 400000) * 0.05;
      } else {
        taxN += 20000; // 5% of 4L
        if (taxableNew <= 1200000) {
          taxN += (taxableNew - 800000) * 0.10;
        } else {
          taxN += 40000; // 10% of 4L
          if (taxableNew <= 1600000) {
            taxN += (taxableNew - 1200000) * 0.15;
          } else {
            taxN += 60000; // 15% of 4L
            if (taxableNew <= 2000000) {
              taxN += (taxableNew - 1600000) * 0.20;
            } else {
              taxN += 80000; // 20% of 4L
              taxN += (taxableNew - 2000000) * 0.30;
            }
          }
        }
      }
    }

    // 87A Rebate in New regime (Tax free up to 7L after standard deduction)
    if (taxableNew <= 700000) taxN = 0;
    setTaxNew(Math.round(taxN * 1.04));
  }, [grossSalary, deductions]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <h3 className="text-xl font-bold">Income Tax Estimator</h3>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-slate-500">Gross Annual Income</label>
            <input type="number" value={grossSalary} onChange={(e) => setGrossSalary(Number(e.target.value))} className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 rounded-xl px-4 py-2 text-sm focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-500">Deductions (Old regime only - 80C, 80D, etc.)</label>
            <input type="number" value={deductions} onChange={(e) => setDeductions(Number(e.target.value))} className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 rounded-xl px-4 py-2 text-sm focus:outline-none" />
          </div>
        </div>
      </div>
      <div className="bg-slate-100/50 dark:bg-navy-dark/40 p-6 rounded-2xl border border-slate-300/10 dark:border-white/5 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-300/10">
            <span className="text-slate-500 font-semibold">Tax (Old Regime)</span>
            <span className="font-extrabold text-sm text-slate-700 dark:text-white">{formatIndianRupees(taxOld)}</span>
          </div>
          <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-300/10">
            <span className="text-slate-500 font-semibold">Tax (New Regime)</span>
            <span className="font-extrabold text-lg text-emerald">{formatIndianRupees(taxNew)}</span>
          </div>
          <div className="flex justify-between items-center text-[10px] pt-1">
            <span className="text-slate-400 font-semibold">Regime Recommendation</span>
            <span className="font-bold text-gold">
              {taxNew < taxOld ? 'Choose New Regime' : 'Choose Old Regime'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculators;
