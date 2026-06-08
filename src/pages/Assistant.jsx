import React, { useContext, useState, useRef, useEffect } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { GlassPanel } from '../components/GlassPanel';
import { Icon } from '../components/Icon';
import { formatIndianRupees } from '../utils/financeUtils';

export const Assistant = () => {
  const { transactions, investments, budgets, goals, currency } = useContext(FinanceContext);
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'assistant',
      text: "Namaste! I am your Finovo AI Finance Assistant. How can I help you manage your wealth today? You can ask me to analyze your expenses, suggest an investment plan, or draft a monthly budget.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messageEndRef = useRef(null);

  // Auto scroll to latest message
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Calculate live financial numbers for context-aware responses
  const income = transactions.filter(t => t.type === 'income' && t.date.startsWith('2026-06')).reduce((a, b) => a + b.amount, 0) || 85000;
  const expense = transactions.filter(t => t.type === 'expense' && t.date.startsWith('2026-06')).reduce((a, b) => a + b.amount, 0) || 52400;
  const savings = Math.max(0, income - expense);
  const totalHoldings = investments.reduce((a, b) => a + b.currentValue, 0) || 875000;

  // Suggested quick prompts
  const quickPrompts = [
    "Analyze my expenses.",
    "Create my monthly budget.",
    "Suggest investment allocation.",
    "How can I save more money?",
    "Explain compound interest."
  ];

  // Helper response logic
  const getAIResponse = (input) => {
    const text = input.toLowerCase();
    
    if (text.includes('analyze') && text.includes('expense')) {
      // Find top expense category
      const categoriesMap = {};
      transactions
        .filter(t => t.type === 'expense' && t.date.startsWith('2026-06'))
        .forEach(t => {
          categoriesMap[t.category] = (categoriesMap[t.category] || 0) + t.amount;
        });
      
      let topCategory = 'None';
      let topValue = 0;
      Object.keys(categoriesMap).forEach(c => {
        if (categoriesMap[c] > topValue) {
          topValue = categoriesMap[c];
          topCategory = c;
        }
      });

      return `Here is an analysis of your June expenses:
• Total June Expenses: ${formatIndianRupees(expense)}
• Highest Expense Category: **${topCategory}** (${formatIndianRupees(topValue)})
• Current Savings Rate: **${Math.round((savings / income) * 100)}%** of your income.

💡 **Observation**: Your savings rate is healthy, but spending on *${topCategory}* accounts for a substantial chunk of your budget. Consider setting a strict limit on *${topCategory}* to unlock an extra ₹2,000–₹5,000 in monthly SIP savings.`;
    }

    if (text.includes('budget') || text.includes('create') && text.includes('monthly')) {
      const needs = Math.round(income * 0.5);
      const wants = Math.round(income * 0.3);
      const invest = Math.round(income * 0.2);
      
      return `Based on your monthly income of **${formatIndianRupees(income)}**, I recommend applying the standard **50/30/20 Budgeting Rule**:

1. **Needs (50%)**: **${formatIndianRupees(needs)}**
   *Use for: Rent, EMIs, Utilities, Groceries, Insurance.*
2. **Wants (30%)**: **${formatIndianRupees(wants)}**
   *Use for: Dining out, Shopping, Movie tickets, Travel.*
3. **Investments & Savings (20%)**: **${formatIndianRupees(invest)}**
   *Use for: Mutual Fund SIPs, Stocks, EPF/PPF, and Emergency Fund.*

Currently, you are spending **${formatIndianRupees(expense)}** (${Math.round((expense/income)*100)}%), which is close to your limit. Try cutting down discretionary shopping this week.`;
    }

    if (text.includes('suggest') || text.includes('investment') || text.includes('allocation')) {
      return `Here is a review of your current portfolio allocation:
• Equity & Mutual Funds: **65%** (High growth potential)
• Gold & Fixed Deposits: **18%** (Provides portfolio buffer)
• Liquid Cash & Crypto: **17%** (High liquidity / risk)

💡 **Recommendation**: For a balanced profile, consider allocating:
1. **60% in Equity Mutual Funds** (SIPs in Nifty Index, Flexi-cap & Small-cap).
2. **20% in Sovereign Gold Bonds (SGB)** or digital gold to hedge inflation.
3. **15% in Debt instruments** (PPF for tax-free compounding, Fixed Deposits).
4. **5% in Crypto** or speculative equity only if you have a high risk tolerance.`;
    }

    if (text.includes('save') || text.includes('money')) {
      return `Here are three highly actionable ways to boost your savings in India:
1. **Automate Savings on Payday**: Set up automatic mutual fund SIP transfers on the 2nd of every month, right after salary credit.
2. **Audit Subscriptions**: Cancel gym memberships or video streaming platforms (Netflix, Hotstar) you haven't accessed in 30 days.
3. **The 30-Day Delay Rule**: When planning non-essential purchases (e.g. new electronics, designer wear), wait 30 days. If the urge persists, buy it. This eliminates impulsive buying.`;
    }

    if (text.includes('compound') || text.includes('interest')) {
      return `**Compound Interest** is the interest you earn on interest. Albert Einstein famously called it the "8th Wonder of the World."

**How it works**:
- Year 1: You invest **₹1,00,000** at **10% returns**. You earn ₹10,000. Total value: **₹1,10,000**.
- Year 2: You earn 10% on **₹1,10,000** (not just the initial ₹1L). You earn ₹11,000. Total value: **₹1,21,000**.
- Year 10: Your corpus grows to **₹2,59,374**!

🚀 **The key is Time**: The longer you keep your money invested, the steeper the exponential growth curve. Starting a SIP at age 22 instead of 30 can double your ultimate retirement corpus!`;
    }

    if (text.includes('debt') || text.includes('reduce') || text.includes('loan')) {
      return `To reduce debt efficiently, use one of these two standard methods:
1. **The Avalanche Method (Recommended)**: List all loans by interest rate. Pay the minimum on all, and dump every extra rupee into the loan with the *highest interest rate* (e.g. credit card debt, personal loans). This saves the most money.
2. **The Snowball Method**: List loans by principal amount. Pay off the *smallest loan first* to gain psychological momentum.

Avoid taking credit card EMIs for discretionary spending (shopping, dining out) as interest rates range from 15% to 42% annually.`;
    }

    return `I appreciate your question! I can help you with specific tasks. Try clicking one of the suggestions above or ask about:
- "Explain SIP vs Lumpsum"
- "How much emergency fund do I need?"
- "Analyze my expenses"
- "Tax regime comparison guidance"`;
  };

  const handleSendMessage = (textToSend) => {
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg = {
      id: `m-user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI typing delay
    setTimeout(() => {
      const aiResponse = getAIResponse(textToSend);
      const aiMsg = {
        id: `m-ai-${Date.now()}`,
        sender: 'assistant',
        text: aiResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 p-4 md:p-8 max-w-5xl mx-auto h-[calc(100vh-140px)] flex flex-col justify-between">
      {/* Header info */}
      <div className="flex items-center space-x-3 pb-4 border-b border-slate-300/20 dark:border-white/5">
        <div className="w-10 h-10 rounded-full bg-emerald/10 text-emerald flex items-center justify-center border border-emerald/20">
          <Icon name="MessageSquare" size={20} />
        </div>
        <div>
          <h1 className="text-xl font-bold">AI Finance Assistant</h1>
          <p className="text-xs text-slate-500">Intelligent, customized suggestions based on your personal ledgers.</p>
        </div>
      </div>

      {/* Messages Window */}
      <GlassPanel className="flex-1 overflow-y-auto space-y-4 p-4 no-scrollbar max-h-[480px]">
        {messages.map(m => (
          <div 
            key={m.id} 
            className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-200`}
          >
            <div 
              className={`max-w-[80%] rounded-2xl p-4 text-sm whitespace-pre-line leading-relaxed ${
                m.sender === 'user' 
                  ? 'bg-emerald text-white rounded-tr-none' 
                  : 'bg-slate-200/60 dark:bg-navy-light/60 border border-slate-300/35 dark:border-white/5 rounded-tl-none'
              }`}
            >
              <p>{m.text}</p>
              <span className="block text-[9px] text-slate-400 dark:text-slate-400 mt-2 text-right">
                {m.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-200/60 dark:bg-navy-light/60 border border-slate-300/35 dark:border-white/5 rounded-2xl rounded-tl-none p-4 text-xs text-slate-400 flex items-center space-x-1.5">
              <span>Finovo AI is calculating</span>
              <span className="flex space-x-0.5">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75" />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150" />
              </span>
            </div>
          </div>
        )}
        <div ref={messageEndRef} />
      </GlassPanel>

      {/* Prompt helper chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
        {quickPrompts.map(p => (
          <button
            key={p}
            onClick={() => handleSendMessage(p)}
            className="bg-slate-100 dark:bg-navy-dark hover:bg-slate-200 dark:hover:bg-slate-800 text-[10px] md:text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-300/30 dark:border-white/5 text-slate-400 dark:text-slate-300 whitespace-nowrap transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Inputs tray */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputValue);
        }}
        className="flex items-center space-x-3 bg-slate-100 dark:bg-navy-dark p-2 rounded-2xl border border-slate-300/30 dark:border-white/5"
      >
        <input 
          type="text" 
          placeholder="Ask something (e.g. Suggest investment allocation)..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 bg-transparent border-none focus:outline-none text-sm px-3 py-2 text-slate-800 dark:text-white"
        />
        <button
          type="submit"
          className="p-2 bg-emerald hover:bg-emerald-dark text-white rounded-xl shadow-lg transition-colors flex items-center justify-center"
        >
          <Icon name="Send" size={16} />
        </button>
      </form>
    </div>
  );
};

export default Assistant;
