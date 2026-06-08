import React, { createContext, useState, useEffect } from 'react';

export const FinanceContext = createContext();

// Default transaction categories
const DEFAULT_CATEGORIES = [
  { id: 'cat-food', name: 'Food', icon: 'Utensils', color: '#10B981', isCustom: false },
  { id: 'cat-rent', name: 'Rent', icon: 'Home', color: '#3B82F6', isCustom: false },
  { id: 'cat-emi', name: 'EMI', icon: 'Landmark', color: '#EF4444', isCustom: false },
  { id: 'cat-fuel', name: 'Fuel', icon: 'Car', color: '#F59E0B', isCustom: false },
  { id: 'cat-shopping', name: 'Shopping', icon: 'ShoppingBag', color: '#EC4899', isCustom: false },
  { id: 'cat-travel', name: 'Travel', icon: 'Plane', color: '#8B5CF6', isCustom: false },
  { id: 'cat-entertainment', name: 'Entertainment', icon: 'Film', color: '#6366F1', isCustom: false },
  { id: 'cat-healthcare', name: 'Healthcare', icon: 'Activity', color: '#14B8A6', isCustom: false },
  { id: 'cat-education', name: 'Education', icon: 'GraduationCap', color: '#06B6D4', isCustom: false },
  { id: 'cat-utilities', name: 'Utilities', icon: 'Wrench', color: '#64748B', isCustom: false },
  { id: 'cat-investment', name: 'Investment', icon: 'TrendingUp', color: '#F4B400', isCustom: false },
  { id: 'cat-insurance', name: 'Insurance', icon: 'Shield', color: '#10B981', isCustom: false },
];

// Default budget limits
const DEFAULT_BUDGETS = {
  'Food': 12000,
  'Transport': 5000,
  'Rent': 25000,
  'Bills': 8000,
  'Entertainment': 6000,
  'Shopping': 10000,
  'Healthcare': 4000,
  'Travel': 10000
};

// Seed transaction logs
const SEED_TRANSACTIONS = [
  { id: 't1', type: 'income', amount: 85000, category: 'Salary', date: '2026-06-01', notes: 'Monthly salary credited', paymentMethod: 'Direct Deposit' },
  { id: 't2', type: 'expense', amount: 25000, category: 'Rent', date: '2026-06-02', notes: 'Apartment rent', paymentMethod: 'Net Banking' },
  { id: 't3', type: 'expense', amount: 8500, category: 'EMI', date: '2026-06-03', notes: 'Car Loan EMI', paymentMethod: 'Auto Debit' },
  { id: 't4', type: 'expense', amount: 4800, category: 'Food', date: '2026-06-04', notes: 'Weekly grocery at Blinkit', paymentMethod: 'UPI' },
  { id: 't5', type: 'expense', amount: 3200, category: 'Utilities', date: '2026-06-04', notes: 'Electricity bill', paymentMethod: 'UPI' },
  { id: 't6', type: 'expense', amount: 1200, category: 'Fuel', date: '2026-06-05', notes: 'Petrol refueling', paymentMethod: 'Credit Card' },
  { id: 't7', type: 'expense', amount: 6500, category: 'Shopping', date: '2026-06-05', notes: 'Summer clothing', paymentMethod: 'Credit Card' },
  { id: 't8', type: 'expense', amount: 1800, category: 'Food', date: '2026-06-06', notes: 'Dinner at restaurant', paymentMethod: 'UPI' },
  { id: 't9', type: 'expense', amount: 1400, category: 'Entertainment', date: '2026-06-06', notes: 'Movie tickets', paymentMethod: 'UPI' },
];

// Seed savings goals
const SEED_GOALS = [
  { id: 'g1', name: 'House Downpayment', targetAmount: 1500000, savedAmount: 450000, deadline: '2028-12-31', monthlyContribution: 25000, icon: 'Home' },
  { id: 'g2', name: 'New SUV', targetAmount: 800000, savedAmount: 300000, deadline: '2027-06-30', monthlyContribution: 15000, icon: 'Car' },
  { id: 'g3', name: 'Europe Vacation', targetAmount: 400000, savedAmount: 220000, deadline: '2026-10-15', monthlyContribution: 20000, icon: 'Plane' },
  { id: 'g4', name: 'Emergency Fund', targetAmount: 300000, savedAmount: 210000, deadline: '2026-12-31', monthlyContribution: 10000, icon: 'Shield' }
];

// Seed investment holdings
const SEED_INVESTMENTS = [
  { id: 'i1', type: 'Mutual Funds', name: 'Parag Parikh Flexi Cap Fund', investedAmount: 350000, currentValue: 425000, sipAmount: 15000, allocation: 40 },
  { id: 'i2', type: 'Stocks', name: 'Reliance Industries Ltd.', investedAmount: 200000, currentValue: 218000, sipAmount: 0, allocation: 25 },
  { id: 'i3', type: 'ETFs', name: 'Nifty 50 BeES', investedAmount: 120000, currentValue: 132000, sipAmount: 5000, allocation: 15 },
  { id: 'i4', type: 'Gold', name: 'Sovereign Gold Bonds (SGB)', investedAmount: 100000, currentValue: 115000, sipAmount: 0, allocation: 11 },
  { id: 'i5', type: 'Fixed Deposits', name: 'HDFC Bank FD', investedAmount: 80000, currentValue: 85000, sipAmount: 0, allocation: 7 },
  { id: 'i6', type: 'Crypto', name: 'Bitcoin (BTC)', investedAmount: 25000, currentValue: 32600, sipAmount: 1000, allocation: 2 }
];

// Seed default widgets
const DEFAULT_WIDGETS = [
  { id: 'total-balance', title: 'Total Balance', visible: true, order: 0 },
  { id: 'monthly-income', title: 'Monthly Income', visible: true, order: 1 },
  { id: 'monthly-expenses', title: 'Monthly Expenses', visible: true, order: 2 },
  { id: 'savings', title: 'Savings', visible: true, order: 3 },
  { id: 'investments', title: 'Investments', visible: true, order: 4 },
  { id: 'emergency-fund', title: 'Emergency Fund', visible: true, order: 5 }
];

export const FinanceProvider = ({ children }) => {
  const [activePage, setActivePage] = useState('home');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [currency, setCurrency] = useState(() => localStorage.getItem('currency') || '₹');
  const [isOnboarded, setIsOnboarded] = useState(() => localStorage.getItem('isOnboarded') === 'true');
  const [startingBalance, setStartingBalance] = useState(() => Number(localStorage.getItem('startingBalance')) || 542850);
  
  // Profile settings
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('profile');
    return saved ? JSON.parse(saved) : { name: 'Yogi Patel', email: 'yogi.patel@finovo.in', photo: null, timezone: 'IST (UTC+5:30)', age: '', profession: '' };
  });

  // Custom Categories
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  // Transaction state
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : SEED_TRANSACTIONS;
  });

  // Budgets state
  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem('budgets');
    return saved ? JSON.parse(saved) : DEFAULT_BUDGETS;
  });

  // Goals state
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('goals');
    return saved ? JSON.parse(saved) : SEED_GOALS;
  });

  // Investments state
  const [investments, setInvestments] = useState(() => {
    const saved = localStorage.getItem('investments');
    return saved ? JSON.parse(saved) : SEED_INVESTMENTS;
  });

  // Widgets configuration (customizable layout)
  const [widgets, setWidgets] = useState(() => {
    const saved = localStorage.getItem('widgets');
    return saved ? JSON.parse(saved) : DEFAULT_WIDGETS;
  });

  // Notifications state
  const [notifications, setNotifications] = useState([
    { id: 'n1', type: 'info', message: 'Welcome to Finovo! Customize your dashboard inside Settings.', date: new Date().toLocaleDateString(), read: false },
    { id: 'n2', type: 'success', message: 'Salary of ₹85,000 credited to account.', date: '2026-06-01', read: true },
    { id: 'n3', type: 'warning', message: 'Shopping budget has exceeded 80% limit!', date: '2026-06-05', read: false }
  ]);

  // Sync state to localstorage
  useEffect(() => {
    localStorage.setItem('theme', theme);
    const body = document.body;
    if (theme === 'dark') {
      body.classList.add('dark');
    } else {
      body.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    checkBudgetsAndNotify();
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
    checkBudgetsAndNotify();
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('investments', JSON.stringify(investments));
  }, [investments]);

  useEffect(() => {
    localStorage.setItem('widgets', JSON.stringify(widgets));
  }, [widgets]);

  // Logic to monitor budgets and auto-trigger warnings
  const checkBudgetsAndNotify = () => {
    // Group monthly expenses by category for June 2026 (current month in seed)
    const currentMonthExpenses = {};
    transactions
      .filter(t => t.type === 'expense' && t.date.startsWith('2026-06'))
      .forEach(t => {
        // Find mapped category
        let catName = t.category;
        currentMonthExpenses[catName] = (currentMonthExpenses[catName] || 0) + t.amount;
      });

    const newNotifications = [];
    Object.keys(budgets).forEach(cat => {
      const budgetLimit = budgets[cat];
      const spent = currentMonthExpenses[cat] || 0;
      if (budgetLimit > 0 && spent >= budgetLimit * 0.8) {
        const percent = Math.round((spent / budgetLimit) * 100);
        const exists = notifications.some(n => n.message.includes(`budget for ${cat}`) && n.message.includes(`${percent}%`));
        if (!exists) {
          newNotifications.push({
            id: `nb-${cat}-${Date.now()}`,
            type: spent > budgetLimit ? 'danger' : 'warning',
            message: spent > budgetLimit 
              ? `⚠️ Budget Exceeded! You spent ${percent}% of your budget for ${cat}.` 
              : `⚠️ Budget Warning! You spent ${percent}% of your budget for ${cat}.`,
            date: new Date().toLocaleDateString(),
            read: false
          });
        }
      }
    });

    if (newNotifications.length > 0) {
      setNotifications(prev => [...newNotifications, ...prev]);
    }
  };

  // Transaction CRUD handlers
  const addTransaction = (t) => {
    const newTx = { ...t, id: `t-${Date.now()}` };
    setTransactions(prev => [newTx, ...prev]);
    
    // Add success notification
    if (t.type === 'income') {
      addNotification('success', `Salary/Income of ${currency}${t.amount} credited.`);
    }
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateTransaction = (updated) => {
    setTransactions(prev => prev.map(t => t.id === updated.id ? updated : t));
  };

  // Category CRUD handlers
  const addCategory = (name, icon, color) => {
    const newCat = {
      id: `cat-${Date.now()}`,
      name,
      icon,
      color,
      isCustom: true
    };
    setCategories(prev => [...prev, newCat]);
  };

  const deleteCategory = (id) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const renameCategory = (id, newName) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, name: newName } : c));
  };

  // Goal CRUD handlers
  const addGoal = (g) => {
    setGoals(prev => [...prev, { ...g, id: `g-${Date.now()}` }]);
  };

  const deleteGoal = (id) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const updateGoalProgress = (id, saveAmount) => {
    setGoals(prev => prev.map(g => {
      if (g.id === id) {
        const updatedSaved = g.savedAmount + Number(saveAmount);
        if (updatedSaved >= g.targetAmount) {
          addNotification('success', `🎯 Congratulations! You have reached your savings goal: "${g.name}"!`);
        }
        return { ...g, savedAmount: Math.min(updatedSaved, g.targetAmount) };
      }
      return g;
    }));
  };

  // Investments CRUD
  const addInvestment = (inv) => {
    setInvestments(prev => [...prev, { ...inv, id: `inv-${Date.now()}` }]);
  };

  const deleteInvestment = (id) => {
    setInvestments(prev => prev.filter(i => i.id !== id));
  };

  const addNotification = (type, message) => {
    setNotifications(prev => [
      { id: `n-${Date.now()}`, type, message, date: new Date().toLocaleDateString(), read: false },
      ...prev
    ]);
  };

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const updateWidgetLayout = (newWidgets) => {
    setWidgets(newWidgets);
  };

  // Backup & restore
  const restoreBackup = (backupData) => {
    try {
      const parsed = JSON.parse(backupData);
      if (parsed.transactions) setTransactions(parsed.transactions);
      if (parsed.budgets) setBudgets(parsed.budgets);
      if (parsed.goals) setGoals(parsed.goals);
      if (parsed.investments) setInvestments(parsed.investments);
      if (parsed.categories) setCategories(parsed.categories);
      if (parsed.profile) setProfile(parsed.profile);
      addNotification('success', 'Backup restored successfully.');
      return true;
    } catch (e) {
      addNotification('danger', 'Invalid backup file format.');
      return false;
    }
  };

  const onboardUser = (data) => {
    const startBal = Number(data.startingBalance) || 0;
    setStartingBalance(startBal);
    localStorage.setItem('startingBalance', startBal.toString());

    const updatedProfile = {
      name: data.name,
      email: data.email || 'user@finovo.in',
      age: Number(data.age),
      profession: data.profession,
      timezone: 'IST (UTC+5:30)'
    };
    setProfile(updatedProfile);
    
    const salaryAmt = Number(data.income);
    const salaryTx = {
      id: `t-salary-${Date.now()}`,
      type: 'income',
      amount: salaryAmt,
      category: 'Salary',
      date: new Date().toISOString().substring(0, 10),
      notes: `${data.profession} monthly salary credited`,
      paymentMethod: 'Direct Deposit'
    };
    
    setTransactions([salaryTx]);
    setBudgets(data.budgets);

    if (data.goalName && data.goalTarget) {
      const userGoal = {
        id: `g-user-${Date.now()}`,
        name: data.goalName,
        targetAmount: Number(data.goalTarget),
        savedAmount: Number(data.goalSaved) || 0,
        deadline: data.goalDeadline || new Date(Date.now() + 365*24*60*60*1000).toISOString().substring(0, 10),
        monthlyContribution: Number(data.goalContribution) || 0,
        icon: 'Target'
      };
      setGoals([userGoal]);
    } else {
      setGoals([]);
    }

    if (data.isInvesting && data.investments && data.investments.length > 0) {
      setInvestments(data.investments);
    } else {
      setInvestments([]);
    }

    setIsOnboarded(true);
    localStorage.setItem('isOnboarded', 'true');
    addNotification('success', `Welcome, ${data.name}! Your customizable dashboard is now set up.`);
  };

  return (
    <FinanceContext.Provider value={{
      activePage,
      setActivePage,
      theme,
      setTheme,
      currency,
      setCurrency,
      profile,
      setProfile,
      categories,
      addCategory,
      deleteCategory,
      renameCategory,
      transactions,
      addTransaction,
      deleteTransaction,
      updateTransaction,
      budgets,
      setBudgets,
      goals,
      addGoal,
      deleteGoal,
      updateGoalProgress,
      investments,
      addInvestment,
      deleteInvestment,
      widgets,
      updateWidgetLayout,
      notifications,
      addNotification,
      markNotificationRead,
      clearAllNotifications,
      restoreBackup,
      isOnboarded,
      setIsOnboarded,
      onboardUser,
      startingBalance,
      setStartingBalance
    }}>
      {children}
    </FinanceContext.Provider>
  );
};
