import React, { useState, useContext, useEffect } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { GlassPanel } from './GlassPanel';
import { Icon } from './Icon';
import { formatIndianRupees } from '../utils/financeUtils';

export const OnboardingWizard = () => {
  const { onboardUser, currency, setActivePage } = useContext(FinanceContext);
  const [step, setStep] = useState(1);

  // Onboarding wizard states
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [profession, setProfession] = useState('');
  const [income, setIncome] = useState('');
  const [startingBalance, setStartingBalance] = useState('');

  // Budgets state
  const [budgetRent, setBudgetRent] = useState('');
  const [budgetFood, setBudgetFood] = useState('');
  const [budgetShopping, setBudgetShopping] = useState('');
  const [budgetBills, setBudgetBills] = useState('');
  const [budgetEntertainment, setBudgetEntertainment] = useState('');

  // Automatically calculate budgets when income changes
  useEffect(() => {
    const inc = Number(income);
    if (inc > 0) {
      setBudgetRent(Math.round(inc * 0.30).toString());
      setBudgetFood(Math.round(inc * 0.15).toString());
      setBudgetShopping(Math.round(inc * 0.10).toString());
      setBudgetBills(Math.round(inc * 0.10).toString());
      setBudgetEntertainment(Math.round(inc * 0.05).toString());
    }
  }, [income]);

  // Goals state
  const [goalName, setGoalName] = useState('Emergency Fund');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalSaved, setGoalSaved] = useState('');
  const [goalDeadline, setGoalDeadline] = useState('');
  const [goalContribution, setGoalContribution] = useState('');

  // Investments state
  const [isInvesting, setIsInvesting] = useState(false);
  const [invMF, setInvMF] = useState('');
  const [invMFVal, setInvMFVal] = useState('');
  const [invStocks, setInvStocks] = useState('');
  const [invStocksVal, setInvStocksVal] = useState('');
  const [invGold, setInvGold] = useState('');
  const [invGoldVal, setInvGoldVal] = useState('');

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Settle budgets structure
    const budgets = {
      'Rent': Number(budgetRent) || 0,
      'Food': Number(budgetFood) || 0,
      'Shopping': Number(budgetShopping) || 0,
      'Bills': Number(budgetBills) || 0,
      'Entertainment': Number(budgetEntertainment) || 0,
      'Transport': 0, // default placeholder
      'Healthcare': 0,
      'Travel': 0
    };

    // Settle investments list
    const investmentsList = [];
    if (isInvesting) {
      if (invMF && invMFVal) {
        investmentsList.push({
          id: 'inv-mf',
          type: 'Mutual Funds',
          name: 'Core Mutual Funds',
          investedAmount: Number(invMF),
          currentValue: Number(invMFVal),
          sipAmount: 0,
          allocation: 50
        });
      }
      if (invStocks && invStocksVal) {
        investmentsList.push({
          id: 'inv-stocks',
          type: 'Stocks',
          name: 'Core Equity Holdings',
          investedAmount: Number(invStocks),
          currentValue: Number(invStocksVal),
          sipAmount: 0,
          allocation: 30
        });
      }
      if (invGold && invGoldVal) {
        investmentsList.push({
          id: 'inv-gold',
          type: 'Gold',
          name: 'Physical/Sovereign Gold',
          investedAmount: Number(invGold),
          currentValue: Number(invGoldVal),
          sipAmount: 0,
          allocation: 20
        });
      }
    }

    onboardUser({
      name,
      age,
      profession,
      income,
      startingBalance,
      budgets,
      goalName,
      goalTarget,
      goalSaved,
      goalDeadline,
      goalContribution,
      isInvesting,
      investments: investmentsList
    });

    setActivePage('dashboard');
  };

  const percentSpent = (amount) => {
    if (!income || !amount) return 0;
    return Math.round((Number(amount) / Number(income)) * 100);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gold/5 blur-[120px] pointer-events-none" />

      <GlassPanel className="w-full max-w-lg border-emerald/20 shadow-2xl p-8 relative overflow-hidden">
        {/* Progress bar indicator */}
        <div className="w-full bg-slate-200 dark:bg-navy-light h-1.5 rounded-full overflow-hidden mb-8">
          <div 
            className="bg-emerald h-full rounded-full transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Step 1: Personal Details */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1.5">
              <h2 className="text-2xl font-bold">First, tell us about yourself</h2>
              <p className="text-xs text-slate-500">Let's set up your profile details on Finovo.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-500 font-semibold">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Yogi Patel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/35 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 font-semibold">Age</label>
                  <input
                    type="number"
                    placeholder="e.g. 28"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/35 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 font-semibold">Profession</label>
                  <input
                    type="text"
                    placeholder="e.g. Software Engineer"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/35 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="button"
                disabled={!name || !age || !profession}
                onClick={nextStep}
                className="w-full bg-emerald text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center space-x-2 hover:bg-emerald-dark disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/10"
              >
                <span>Continue</span>
                <Icon name="ArrowRight" size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Income */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1.5">
              <h2 className="text-2xl font-bold">Your Monthly Income</h2>
              <p className="text-xs text-slate-500">Provide your primary monthly salary or business income in Rupees.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-500 font-semibold">Monthly Income ({currency})</label>
                <input
                  type="number"
                  placeholder="e.g. 85000"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/35 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald font-semibold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-500 font-semibold">Current Bank & Cash Balance ({currency})</label>
                <span className="text-[10.5px] text-slate-400 block mb-1">
                  ⚠️ Enter your current starting balance (avoid putting random/mock numbers for accurate calculations)
                </span>
                <input
                  type="number"
                  placeholder="e.g. 150000"
                  value={startingBalance}
                  onChange={(e) => setStartingBalance(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/35 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald font-semibold"
                  required
                />
              </div>

              {income && (
                <div className="p-4 bg-emerald/10 text-emerald rounded-xl text-xs font-semibold flex items-center space-x-2">
                  <Icon name="TrendingUp" size={16} />
                  <span>Your annual gross income is computed as {formatIndianRupees(Number(income) * 12)}.</span>
                </div>
              )}
            </div>

            <div className="pt-4 flex space-x-3">
              <button
                type="button"
                onClick={prevStep}
                className="w-1/2 border border-slate-300 dark:border-white/10 py-3 rounded-xl text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-800 transition-all"
              >
                Back
              </button>
              <button
                type="button"
                disabled={!income || isNaN(Number(income)) || !startingBalance || isNaN(Number(startingBalance))}
                onClick={nextStep}
                className="w-1/2 bg-emerald text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center space-x-2 hover:bg-emerald-dark disabled:opacity-50 transition-all shadow-lg"
              >
                <span>Next</span>
                <Icon name="ArrowRight" size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Budgets */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1.5">
              <h2 className="text-2xl font-bold">Draft your monthly budgets</h2>
              <p className="text-xs text-slate-500">Set limits for essential spending categories.</p>
              <div className="p-3 bg-emerald/10 border border-emerald/20 text-emerald rounded-xl text-[10.5px] font-semibold flex items-center space-x-1.5 mt-2">
                <Icon name="Sparkles" size={14} className="text-emerald animate-pulse" />
                <span>Budgets pre-filled automatically using standard financial ratios based on your monthly income. You can customize them below.</span>
              </div>
            </div>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {/* Rent */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-500">Rent / Housing</span>
                  <span className="text-slate-400">{percentSpent(budgetRent)}% of income</span>
                </div>
                <input
                  type="number"
                  placeholder="e.g. 20000"
                  value={budgetRent}
                  onChange={(e) => setBudgetRent(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/35 dark:border-white/5 rounded-xl px-4 py-2 text-sm focus:outline-none"
                />
              </div>

              {/* Food */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-500">Food / Groceries</span>
                  <span className="text-slate-400">{percentSpent(budgetFood)}% of income</span>
                </div>
                <input
                  type="number"
                  placeholder="e.g. 10000"
                  value={budgetFood}
                  onChange={(e) => setBudgetFood(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/35 dark:border-white/5 rounded-xl px-4 py-2 text-sm focus:outline-none"
                />
              </div>

              {/* Shopping */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-500">Shopping / Clothing</span>
                  <span className="text-slate-400">{percentSpent(budgetShopping)}% of income</span>
                </div>
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  value={budgetShopping}
                  onChange={(e) => setBudgetShopping(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/35 dark:border-white/5 rounded-xl px-4 py-2 text-sm focus:outline-none"
                />
              </div>

              {/* Bills */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-500">Bills & Utilities</span>
                  <span className="text-slate-400">{percentSpent(budgetBills)}% of income</span>
                </div>
                <input
                  type="number"
                  placeholder="e.g. 4000"
                  value={budgetBills}
                  onChange={(e) => setBudgetBills(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/35 dark:border-white/5 rounded-xl px-4 py-2 text-sm focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 flex space-x-3">
              <button
                type="button"
                onClick={prevStep}
                className="w-1/2 border border-slate-300 dark:border-white/10 py-3 rounded-xl text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-800 transition-all"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="w-1/2 bg-emerald text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center space-x-2 hover:bg-emerald-dark transition-all shadow-lg"
              >
                <span>Next</span>
                <Icon name="ArrowRight" size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Savings Goal */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1.5">
              <h2 className="text-2xl font-bold">What is your primary savings goal?</h2>
              <p className="text-xs text-slate-500">Set a target to accumulate wealth for major milestones.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-500 font-semibold">Goal Name</label>
                <select
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/35 dark:border-white/5 rounded-xl px-3 py-2.5 text-sm focus:outline-none cursor-pointer"
                >
                  <option value="Emergency Fund">Emergency Fund</option>
                  <option value="House Downpayment">House Downpayment</option>
                  <option value="New Car">New Car / Vehicle</option>
                  <option value="Vacation">Vacation / Travel</option>
                  <option value="Higher Education">Higher Education</option>
                  <option value="Wedding">Wedding Fund</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 font-semibold">Target Corpus ({currency})</label>
                  <input
                    type="number"
                    placeholder="e.g. 300000"
                    value={goalTarget}
                    onChange={(e) => setGoalTarget(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/35 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-500 font-semibold">Already Saved ({currency})</label>
                  <input
                    type="number"
                    placeholder="e.g. 50000"
                    value={goalSaved}
                    onChange={(e) => setGoalSaved(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/35 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 font-semibold">Monthly Contribution</label>
                  <input
                    type="number"
                    placeholder="e.g. 10000"
                    value={goalContribution}
                    onChange={(e) => setGoalContribution(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/35 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 font-semibold">Target Deadline Date</label>
                  <input
                    type="date"
                    value={goalDeadline}
                    onChange={(e) => setGoalDeadline(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/35 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none text-slate-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex space-x-3">
              <button
                type="button"
                onClick={prevStep}
                className="w-1/2 border border-slate-300 dark:border-white/10 py-3 rounded-xl text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-800 transition-all"
              >
                Back
              </button>
              <button
                type="button"
                disabled={!goalTarget || !goalDeadline}
                onClick={nextStep}
                className="w-1/2 bg-emerald text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center space-x-2 hover:bg-emerald-dark disabled:opacity-50 transition-all shadow-lg"
              >
                <span>Next</span>
                <Icon name="ArrowRight" size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Investments */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1.5">
              <h2 className="text-2xl font-bold">What about your investments?</h2>
              <p className="text-xs text-slate-500">Provide details on stock, mutual funds, or gold holdings.</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-100/50 dark:bg-navy-dark/40 border border-slate-300/20 dark:border-white/5 rounded-xl">
                <div>
                  <span className="font-semibold text-sm block">Are you currently investing?</span>
                  <span className="text-[10px] text-slate-500">Share holdings, SIP mutual funds, or deposits.</span>
                </div>

                <div className="flex bg-slate-200 dark:bg-navy-light p-0.5 rounded-lg border border-slate-300/10">
                  <button
                    type="button"
                    onClick={() => setIsInvesting(true)}
                    className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                      isInvesting ? 'bg-emerald text-white' : 'text-slate-400'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsInvesting(false)}
                    className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                      !isInvesting ? 'bg-rose-500 text-white' : 'text-slate-400'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              {isInvesting && (
                <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
                  {/* Mutual Funds */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-semibold">Mutual Funds (Invested)</label>
                      <input
                        type="number"
                        placeholder="₹ Invested"
                        value={invMF}
                        onChange={(e) => setInvMF(e.target.value)}
                        className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/20 dark:border-white/5 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-semibold">Mutual Funds (Current Value)</label>
                      <input
                        type="number"
                        placeholder="₹ Value"
                        value={invMFVal}
                        onChange={(e) => setInvMFVal(e.target.value)}
                        className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/20 dark:border-white/5 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Stocks */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-semibold">Stocks (Invested)</label>
                      <input
                        type="number"
                        placeholder="₹ Invested"
                        value={invStocks}
                        onChange={(e) => setInvStocks(e.target.value)}
                        className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/20 dark:border-white/5 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-semibold">Stocks (Current Value)</label>
                      <input
                        type="number"
                        placeholder="₹ Value"
                        value={invStocksVal}
                        onChange={(e) => setInvStocksVal(e.target.value)}
                        className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/20 dark:border-white/5 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Gold */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-semibold">Gold (Invested)</label>
                      <input
                        type="number"
                        placeholder="₹ Invested"
                        value={invGold}
                        onChange={(e) => setInvGold(e.target.value)}
                        className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/20 dark:border-white/5 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-semibold">Gold (Current Value)</label>
                      <input
                        type="number"
                        placeholder="₹ Value"
                        value={invGoldVal}
                        onChange={(e) => setInvGoldVal(e.target.value)}
                        className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/20 dark:border-white/5 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 flex space-x-3">
              <button
                type="button"
                onClick={prevStep}
                className="w-1/2 border border-slate-300 dark:border-white/10 py-3 rounded-xl text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-800 transition-all"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="w-1/2 bg-emerald text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center space-x-2 hover:bg-emerald-dark transition-all shadow-lg"
              >
                <span>Launch App</span>
                <Icon name="TrendingUp" size={16} />
              </button>
            </div>
          </div>
        )}
      </GlassPanel>
    </div>
  );
};

export default OnboardingWizard;
