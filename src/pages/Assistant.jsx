import React, { useContext, useState, useRef, useEffect } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { GlassPanel } from '../components/GlassPanel';
import { Icon } from '../components/Icon';
import { formatIndianRupees } from '../utils/financeUtils';

export const Assistant = () => {
  const { transactions, investments, budgets, goals, currency, startingBalance } = useContext(FinanceContext);
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

    // 1. Calculate stats from actual context data
    const totalIncomes = transactions.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);
    
    // Find current month income and expenses dynamically
    const currentMonthStr = new Date().toISOString().substring(0, 7);
    const thisMonthIncomes = transactions.filter(t => t.type === 'income' && t.date.startsWith(currentMonthStr)).reduce((a, b) => a + b.amount, 0) || totalIncomes || 85000;
    const thisMonthExpenses = transactions.filter(t => t.type === 'expense' && t.date.startsWith(currentMonthStr)).reduce((a, b) => a + b.amount, 0) || totalExpenses || 0;
    const thisMonthSavings = Math.max(0, thisMonthIncomes - thisMonthExpenses);

    // Group expenses by category
    const categoriesMap = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoriesMap[t.category] = (categoriesMap[t.category] || 0) + t.amount;
      });

    // Find highest expense category
    let topCategory = 'None';
    let topValue = 0;
    Object.keys(categoriesMap).forEach(c => {
      if (categoriesMap[c] > topValue) {
        topValue = categoriesMap[c];
        topCategory = c;
      }
    });

    // Investment holdings details
    const totalInvested = investments.reduce((a, b) => a + b.investedAmount, 0);
    const totalCurrentVal = investments.reduce((a, b) => a + b.currentValue, 0);
    const totalGainLoss = totalCurrentVal - totalInvested;
    const gainLossPercent = totalInvested > 0 ? ((totalGainLoss / totalInvested) * 100).toFixed(1) : '0';

    // Group investments by asset class
    const assetClasses = {};
    investments.forEach(i => {
      assetClasses[i.type] = (assetClasses[i.type] || 0) + i.currentValue;
    });

    if (text.includes('analyze') && (text.includes('expense') || text.includes('spending') || text.includes('ledger'))) {
      if (transactions.filter(t => t.type === 'expense').length === 0) {
        return `I analyzed your transaction records and found **0 expense entries**. 

💡 **Observation**: Your ledger is currently empty. Go to the **Expense Tracker** or record a transaction directly from the dashboard so that I can analyze your spending patterns!`;
      }

      let breakDownStr = '';
      Object.keys(categoriesMap).forEach(cat => {
        const spent = categoriesMap[cat];
        const cap = budgets[cat] || 0;
        const percentageOfBudget = cap > 0 ? Math.round((spent / cap) * 100) : null;
        breakDownStr += `• **${cat}**: ${formatIndianRupees(spent, currency)} ${
          percentageOfBudget !== null ? `(${percentageOfBudget}% of budget)` : '(No budget cap)'
        }\n`;
      });

      return `Here is a comprehensive data analysis of your expenses:
• **Total Expenses Logged**: ${formatIndianRupees(totalExpenses, currency)}
• **Highest Spending Category**: **${topCategory}** (${formatIndianRupees(topValue, currency)})
• **Savings Rate this Month**: **${Math.round((thisMonthSavings / thisMonthIncomes) * 100)}%** (Income: ${formatIndianRupees(thisMonthIncomes, currency)} | Expenses: ${formatIndianRupees(thisMonthExpenses, currency)})

**Category-wise Breakdown**:
${breakDownStr}

💡 **Analysis & Feedback**:
${
  topValue > 0 
    ? `Your largest cash outflow is under **${topCategory}**. If you can reduce this specific category spending by 10%, you could allocate an extra **${formatIndianRupees(topValue * 0.1, currency)}** to your savings or investment SIPs.`
    : `You have zero recorded expenses. Great job keeping outflows at zero, or go log your entries to see dynamic tips!`
}`;
    }

    if (text.includes('budget') || text.includes('create') && text.includes('monthly') || text.includes('recommend') && text.includes('ratio')) {
      const needs = Math.round(thisMonthIncomes * 0.5);
      const wants = Math.round(thisMonthIncomes * 0.3);
      const invest = Math.round(thisMonthIncomes * 0.2);

      let activeBudgetsStr = '';
      let totalBudgetLimit = 0;
      Object.keys(budgets).forEach(bName => {
        if (budgets[bName] > 0) {
          activeBudgetsStr += `• **${bName}**: ${formatIndianRupees(budgets[bName], currency)}\n`;
          totalBudgetLimit += budgets[bName];
        }
      });

      return `Analyzing your budget metrics for your monthly income of **${formatIndianRupees(thisMonthIncomes, currency)}**:

### 📊 Recommended 50/30/20 Standard Ratios:
1. **Needs (50%)**: **${formatIndianRupees(needs, currency)}** (Rent, Utilities, Bills, Groceries)
2. **Wants (30%)**: **${formatIndianRupees(wants, currency)}** (Shopping, Dining Out, Entertainment)
3. **Savings/Investments (20%)**: **${formatIndianRupees(invest, currency)}** (Mutual Funds, Stocks, Goals)

### 🛠️ Your Current Configured Budget Limits:
${activeBudgetsStr || '• *No budget limits set yet! Go to Budget Planner to configure caps.*\n'}
* **Total budgeted limit**: ${formatIndianRupees(totalBudgetLimit, currency)} (${Math.round((totalBudgetLimit / thisMonthIncomes) * 100)}% of income)

💡 **Analysis & Recommendation**:
${
  totalBudgetLimit > thisMonthIncomes
    ? `⚠️ **Warning**: Your configured budget caps sum up to **${formatIndianRupees(totalBudgetLimit, currency)}**, which is **greater than** your monthly income of **${formatIndianRupees(thisMonthIncomes, currency)}**. This structure is unsustainable. I recommend trimming down wants (like Shopping/Entertainment) to ensure your limits fit within your monthly cash flow.`
    : `Your configured budget limits are healthy and total **${formatIndianRupees(totalBudgetLimit, currency)}** (${Math.round((totalBudgetLimit / thisMonthIncomes) * 100)}% of income). This successfully reserves **${formatIndianRupees(thisMonthIncomes - totalBudgetLimit, currency)}** for investments and savings!`
}`;
    }

    if (text.includes('suggest') || text.includes('investment') || text.includes('allocation') || text.includes('portfolio')) {
      if (investments.length === 0) {
        return `I analyzed your portfolio records and found **0 active investment holdings**.

💡 **Investment Allocation Guidance**:
To start growing your wealth, I recommend beginning with a simple **Index Mutual Fund SIP**. 
You can start with as little as ₹500–₹1,000 per month in a low-cost Nifty 50 Index Fund. Go to the **Investments** tab to log your principal outlays when you purchase mutual funds or stocks!`;
      }

      let holdingsStr = '';
      investments.forEach(i => {
        const change = i.currentValue - i.investedAmount;
        const changePct = i.investedAmount > 0 ? ((change / i.investedAmount) * 100).toFixed(1) : '0';
        holdingsStr += `• **${i.name}** (${i.type}): Invested: ${formatIndianRupees(i.investedAmount, currency)} | Current Value: ${formatIndianRupees(i.currentValue, currency)} (${Number(change) >= 0 ? '+' : ''}${changePct}%)\n`;
      });

      let classBreakdownStr = '';
      Object.keys(assetClasses).forEach(ac => {
        const pct = Math.round((assetClasses[ac] / totalCurrentVal) * 100);
        classBreakdownStr += `• **${ac}**: ${formatIndianRupees(assetClasses[ac], currency)} (${pct}% of portfolio)\n`;
      });

      return `Here is a complete, live analysis of your investment portfolio:
• **Total Invested Cost**: ${formatIndianRupees(totalInvested, currency)}
• **Current Valuation**: ${formatIndianRupees(totalCurrentVal, currency)}
• **Absolute Gains/Losses**: **${totalGainLoss >= 0 ? '+' : ''}${formatIndianRupees(totalGainLoss, currency)} (${totalGainLoss >= 0 ? '+' : ''}${gainLossPercent}%)**

### 📂 Asset Class Distribution:
${classBreakdownStr}

### 📝 Current Holdings Breakdown:
${holdingsStr}

💡 **AI Portfolio Recommendation**:
${
  assetClasses['Crypto'] && (assetClasses['Crypto'] / totalCurrentVal) > 0.1
    ? `⚠️ **Portfolio Risk Alert**: Your Crypto holdings account for **${Math.round((assetClasses['Crypto']/totalCurrentVal)*100)}%** of your wealth. This is highly speculative. I suggest reallocating capital into Equity Mutual Funds or Gold to reduce volatility.`
    : `Your portfolio allocation looks healthy! Diversifying across Mutual Funds and Equity buffers you against sector-specific down-cycles. Consider adding physical/sovereign Gold (SGB) if you wish to hedge against inflation.`
}`;
    }

    if (text.includes('save') || text.includes('money') || text.includes('saving') || text.includes('growth')) {
      return `Based on your live profile, here is a custom financial savings advice checklist:
1. **Savings Rate**: You are currently saving **${formatIndianRupees(thisMonthSavings, currency)}** this month (${Math.round((thisMonthSavings / thisMonthIncomes) * 100)}% of income). Aim to maintain a rate above **20%**.
2. **SIP Automation**: Set up auto-debits for your mutual funds on the 2nd of every month, immediately following your salary credits, ensuring you "pay yourself first."
3. **Emergency Fund Buffer**: Make sure to build a safety reserve. A standard buffer covers **6 months of essential expenses** (${formatIndianRupees(Math.round(thisMonthExpenses * 6), currency)}). Check your active goals to track this!`;
    }

    if (text.includes('goal') || text.includes('target') || text.includes('milestone')) {
      if (goals.length === 0) {
        return `I analyzed your goals ledger and found **0 active savings targets**.

💡 **Why set goals?**
Setting specific goals (like an Emergency Fund, House Downpayment, or Vehicle purchase) with clear target values and deadlines helps keep you motivated and structured.
Go to the **Goals** tab to set your first target!`;
      }

      let goalsStr = '';
      goals.forEach(g => {
        const percent = Math.round((g.savedAmount / g.targetAmount) * 100);
        goalsStr += `• **${g.name}**: Saved **${formatIndianRupees(g.savedAmount, currency)}** of **${formatIndianRupees(g.targetAmount, currency)}** (${percent}% complete | Deadline: ${g.deadline})\n`;
      });

      return `Here is a progress report on your active savings goals:

${goalsStr}

💡 **Actionable Tip**:
To hit your deadlines on time, automate your monthly savings contributions. If you're running behind on a target, consider extending the deadline or cutting back on wants to bolster monthly contributions.`;
    }

    if (text.includes('compound') || text.includes('interest')) {
      return `**Compound Interest** is the interest you earn on interest. Albert Einstein famously called it the "8th Wonder of the World."

**How it works**:
- Year 1: You invest **₹1,00,000** at **10% returns**. You earn ₹10,000. Total value: **₹1,10,000**.
- Year 2: You earn 10% on **₹1,10,000** (not just the initial ₹1L). You earn ₹11,000. Total value: **₹1,21,000**.
- Year 10: Your corpus grows to **₹2,59,374**!

🚀 **The key is Time**: The longer you keep your money invested, the steeper the exponential growth curve. Starting a SIP at age 22 instead of 30 can double your ultimate retirement corpus!`;
    }

    if (text.includes('debt') || text.includes('reduce') || text.includes('loan') || text.includes('avalanche') || text.includes('snowball')) {
      return `To reduce debt efficiently, use one of these two standard methods:
1. **The Avalanche Method (Recommended)**: List all loans by interest rate. Pay the minimum on all, and dump every extra rupee into the loan with the *highest interest rate* (e.g. credit card debt, personal loans). This saves the most money.
2. **The Snowball Method**: List loans by principal amount. Pay off the *smallest loan first* to gain psychological momentum.

Avoid taking credit card EMIs for discretionary spending (shopping, dining out) as interest rates range from 15% to 42% annually.`;
    }

    // Default response: dynamic system summary
    return `I parsed your Finovo account details. Here is a live summary of your financial profile:
• **Total Balance (Cash/Bank holdings)**: ${formatIndianRupees(startingBalance + totalIncomes - totalExpenses, currency)}
• **Monthly Income**: ${formatIndianRupees(thisMonthIncomes, currency)}
• **Month Outflows**: ${formatIndianRupees(thisMonthExpenses, currency)}
• **Investment Assets**: ${formatIndianRupees(totalCurrentVal, currency)}
• **Active Savings Goals**: ${goals.length}

How can I help you analyze these details today? You can ask me to:
1. "Analyze my expenses" (find top category and budget utilization)
2. "Create my monthly budget" (review configured caps and ratios)
3. "Suggest investment allocation" (check absolute returns and asset splits)`;
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
