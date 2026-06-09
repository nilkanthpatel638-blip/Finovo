import React, { createContext, useState, useEffect } from 'react';
import { formatIndianRupees } from '../utils/financeUtils';

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

  // Auth States
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('finovo_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const isLoggedIn = !!currentUser;

  // Core financial states (initialized to guest/empty defaults; loaded dynamically per user)
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [startingBalance, setStartingBalance] = useState(0);
  const [profile, setProfile] = useState({ name: 'Guest User', email: '', age: '', profession: '', timezone: 'IST (UTC+5:30)' });
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState(DEFAULT_BUDGETS);
  const [goals, setGoals] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [widgets, setWidgets] = useState(DEFAULT_WIDGETS);
  
  // Custom notifications (settings changes, backups, manually posted messages)
  const [customNotifications, setCustomNotifications] = useState([]);
  // Final combined notifications computed dynamically
  const [notifications, setNotifications] = useState([]);

  // Load user data dynamically when currentUser changes
  useEffect(() => {
    if (currentUser) {
      const emailOrPhone = currentUser.email || currentUser.phone;
      const keyPrefix = `finovo_user_${emailOrPhone}_`;

      // Check if this is a default pre-populated user and doesn't have any stored data yet
      const isPrepopulated = emailOrPhone === 'yogi.patel@finovo.in' || 
                             emailOrPhone === 'yogi.patel@gmail.com' || 
                             emailOrPhone === 'nilkanth.patel@gmail.com' ||
                             emailOrPhone === '+91 98765 43210';

      const hasStoredData = localStorage.getItem(keyPrefix + 'isOnboarded') !== null;

      if (isPrepopulated && !hasStoredData) {
        // Seed initial mock data for pre-populated accounts
        setIsOnboarded(true);
        setStartingBalance(542850);
        
        const initialProfile = { 
          name: currentUser.name || (emailOrPhone.includes('nilkanth') ? 'Nilkanth Patel' : 'Yogi Patel'), 
          email: emailOrPhone.includes('@') ? emailOrPhone : 'yogi.patel@finovo.in', 
          phone: emailOrPhone.includes('@') ? '' : emailOrPhone,
          age: 28, 
          profession: 'Software Engineer', 
          timezone: 'IST (UTC+5:30)' 
        };
        setProfile(initialProfile);
        setCategories(DEFAULT_CATEGORIES);
        setTransactions(SEED_TRANSACTIONS);
        setBudgets(DEFAULT_BUDGETS);
        setGoals(SEED_GOALS);
        setInvestments(SEED_INVESTMENTS);
        setWidgets(DEFAULT_WIDGETS);
        setCustomNotifications([]);

        // Persist to user storage
        localStorage.setItem(keyPrefix + 'isOnboarded', 'true');
        localStorage.setItem(keyPrefix + 'startingBalance', '542850');
        localStorage.setItem(keyPrefix + 'profile', JSON.stringify(initialProfile));
        localStorage.setItem(keyPrefix + 'categories', JSON.stringify(DEFAULT_CATEGORIES));
        localStorage.setItem(keyPrefix + 'transactions', JSON.stringify(SEED_TRANSACTIONS));
        localStorage.setItem(keyPrefix + 'budgets', JSON.stringify(DEFAULT_BUDGETS));
        localStorage.setItem(keyPrefix + 'goals', JSON.stringify(SEED_GOALS));
        localStorage.setItem(keyPrefix + 'investments', JSON.stringify(SEED_INVESTMENTS));
        localStorage.setItem(keyPrefix + 'widgets', JSON.stringify(DEFAULT_WIDGETS));
        localStorage.setItem(keyPrefix + 'customNotifications', JSON.stringify([]));
      } else {
        // Load data from user-scoped keys
        const getLocal = (key, fallback) => {
          const saved = localStorage.getItem(keyPrefix + key);
          if (saved === null) return fallback;
          try {
            return JSON.parse(saved);
          } catch (e) {
            return saved;
          }
        };

        setIsOnboarded(localStorage.getItem(keyPrefix + 'isOnboarded') === 'true');
        setStartingBalance(Number(localStorage.getItem(keyPrefix + 'startingBalance')) || 0);
        setProfile(getLocal('profile', { 
          name: currentUser.name || (emailOrPhone.includes('@') ? emailOrPhone.split('@')[0] : 'User'), 
          email: emailOrPhone.includes('@') ? emailOrPhone : '', 
          phone: emailOrPhone.includes('@') ? '' : emailOrPhone,
          age: '', 
          profession: '', 
          timezone: 'IST (UTC+5:30)' 
        }));
        setCategories(getLocal('categories', DEFAULT_CATEGORIES));
        setTransactions(getLocal('transactions', []));
        setBudgets(getLocal('budgets', DEFAULT_BUDGETS));
        setGoals(getLocal('goals', []));
        setInvestments(getLocal('investments', []));
        setWidgets(getLocal('widgets', DEFAULT_WIDGETS));
        setCustomNotifications(getLocal('customNotifications', []));
      }
    } else {
      // Clear/Reset to Guest State
      setIsOnboarded(false);
      setStartingBalance(0);
      setProfile({ name: 'Guest User', email: '', age: '', profession: '', timezone: 'IST (UTC+5:30)' });
      setCategories(DEFAULT_CATEGORIES);
      setTransactions([]);
      setBudgets(DEFAULT_BUDGETS);
      setGoals([]);
      setInvestments([]);
      setWidgets(DEFAULT_WIDGETS);
      setCustomNotifications([]);
      setNotifications([]);
    }
  }, [currentUser]);

  // Persist user-specific states to localStorage on change
  useEffect(() => {
    if (currentUser) {
      const emailOrPhone = currentUser.email || currentUser.phone;
      const keyPrefix = `finovo_user_${emailOrPhone}_`;
      localStorage.setItem(keyPrefix + 'isOnboarded', isOnboarded ? 'true' : 'false');
    }
  }, [isOnboarded, currentUser]);

  useEffect(() => {
    if (currentUser) {
      const emailOrPhone = currentUser.email || currentUser.phone;
      const keyPrefix = `finovo_user_${emailOrPhone}_`;
      localStorage.setItem(keyPrefix + 'startingBalance', startingBalance.toString());
    }
  }, [startingBalance, currentUser]);

  useEffect(() => {
    if (currentUser) {
      const emailOrPhone = currentUser.email || currentUser.phone;
      const keyPrefix = `finovo_user_${emailOrPhone}_`;
      localStorage.setItem(keyPrefix + 'profile', JSON.stringify(profile));
    }
  }, [profile, currentUser]);

  useEffect(() => {
    if (currentUser) {
      const emailOrPhone = currentUser.email || currentUser.phone;
      const keyPrefix = `finovo_user_${emailOrPhone}_`;
      localStorage.setItem(keyPrefix + 'categories', JSON.stringify(categories));
    }
  }, [categories, currentUser]);

  useEffect(() => {
    if (currentUser) {
      const emailOrPhone = currentUser.email || currentUser.phone;
      const keyPrefix = `finovo_user_${emailOrPhone}_`;
      localStorage.setItem(keyPrefix + 'transactions', JSON.stringify(transactions));
    }
  }, [transactions, currentUser]);

  useEffect(() => {
    if (currentUser) {
      const emailOrPhone = currentUser.email || currentUser.phone;
      const keyPrefix = `finovo_user_${emailOrPhone}_`;
      localStorage.setItem(keyPrefix + 'budgets', JSON.stringify(budgets));
    }
  }, [budgets, currentUser]);

  useEffect(() => {
    if (currentUser) {
      const emailOrPhone = currentUser.email || currentUser.phone;
      const keyPrefix = `finovo_user_${emailOrPhone}_`;
      localStorage.setItem(keyPrefix + 'goals', JSON.stringify(goals));
    }
  }, [goals, currentUser]);

  useEffect(() => {
    if (currentUser) {
      const emailOrPhone = currentUser.email || currentUser.phone;
      const keyPrefix = `finovo_user_${emailOrPhone}_`;
      localStorage.setItem(keyPrefix + 'investments', JSON.stringify(investments));
    }
  }, [investments, currentUser]);

  useEffect(() => {
    if (currentUser) {
      const emailOrPhone = currentUser.email || currentUser.phone;
      const keyPrefix = `finovo_user_${emailOrPhone}_`;
      localStorage.setItem(keyPrefix + 'widgets', JSON.stringify(widgets));
    }
  }, [widgets, currentUser]);

  useEffect(() => {
    if (currentUser) {
      const emailOrPhone = currentUser.email || currentUser.phone;
      const keyPrefix = `finovo_user_${emailOrPhone}_`;
      localStorage.setItem(keyPrefix + 'customNotifications', JSON.stringify(customNotifications));
    }
  }, [customNotifications, currentUser]);

  // Global app themes and currency settings sync
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

  // Dynamic notifications engine matching actual dashboard numbers & transaction logs
  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      return;
    }

    const emailOrPhone = currentUser.email || currentUser.phone;
    const readKey = `finovo_user_${emailOrPhone}_read_notifications`;
    const readIds = JSON.parse(localStorage.getItem(readKey) || '[]');

    const list = [];
    
    // 1. Balance Warning
    const allIncomes = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
    const allExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
    const totalBalance = startingBalance + allIncomes - allExpenses;
    
    if (isOnboarded && totalBalance < 15000) {
      list.push({
        id: 'n-low-balance',
        type: 'danger',
        message: `⚠️ Low balance alert! Your total balance is ${formatIndianRupees(totalBalance, currency)}.`,
        date: new Date().toLocaleDateString()
      });
    }

    // 2. Recent Incomes Credited
    transactions.filter(t => t.type === 'income').forEach(t => {
      list.push({
        id: `n-income-${t.id}`,
        type: 'success',
        message: `💰 Income of ${formatIndianRupees(t.amount, currency)} credited to ledger (${t.category}).`,
        date: t.date
      });
    });

    // 3. High Value Expense Alarms (>= ₹10,000)
    transactions.filter(t => t.type === 'expense' && t.amount >= 10000).forEach(t => {
      list.push({
        id: `n-high-expense-${t.id}`,
        type: 'warning',
        message: `💸 High expense alert: spent ${formatIndianRupees(t.amount, currency)} on ${t.category}.`,
        date: t.date
      });
    });

    // 4. Budget Monitoring (>80% warning / >100% exceeded)
    const currentMonthExpenses = {};
    // Check expenses matching this month
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        currentMonthExpenses[t.category] = (currentMonthExpenses[t.category] || 0) + t.amount;
      });

    Object.keys(budgets).forEach(cat => {
      const budgetLimit = budgets[cat];
      const spent = currentMonthExpenses[cat] || 0;
      if (budgetLimit > 0) {
        const percent = Math.round((spent / budgetLimit) * 100);
        if (percent >= 100) {
          list.push({
            id: `n-budget-exceeded-${cat}`,
            type: 'danger',
            message: `🚨 Budget exceeded! You spent ${percent}% (${formatIndianRupees(spent, currency)} of ${formatIndianRupees(budgetLimit, currency)}) on ${cat}.`,
            date: new Date().toLocaleDateString()
          });
        } else if (percent >= 80) {
          list.push({
            id: `n-budget-warning-${cat}`,
            type: 'warning',
            message: `⚠️ Budget warning: You used ${percent}% (${formatIndianRupees(spent, currency)} of ${formatIndianRupees(budgetLimit, currency)}) on ${cat}.`,
            date: new Date().toLocaleDateString()
          });
        }
      }
    });

    // 5. Savings Goals milestones
    goals.forEach(g => {
      const percent = Math.round((g.savedAmount / g.targetAmount) * 100);
      if (percent >= 100) {
        list.push({
          id: `n-goal-completed-${g.id}`,
          type: 'success',
          message: `🎯 Target achieved! Saved 100% of your ${formatIndianRupees(g.targetAmount, currency)} goal for "${g.name}".`,
          date: new Date().toLocaleDateString()
        });
      } else if (percent >= 50) {
        list.push({
          id: `n-goal-halfway-${g.id}`,
          type: 'info',
          message: `⭐ Goal milestone: You have saved ${percent}% (${formatIndianRupees(g.savedAmount, currency)}) of your target for "${g.name}".`,
          date: new Date().toLocaleDateString()
        });
      }
    });

    // 6. Investments Growth Performance
    const totalInvested = investments.reduce((acc, curr) => acc + curr.investedAmount, 0);
    const totalCurrentVal = investments.reduce((acc, curr) => acc + curr.currentValue, 0);
    if (totalInvested > 0) {
      const growth = ((totalCurrentVal - totalInvested) / totalInvested) * 100;
      if (growth >= 5) {
        list.push({
          id: 'n-investment-growth',
          type: 'success',
          message: `📈 Market growth: Your portfolio valuation has grown by +${growth.toFixed(1)}% to ${formatIndianRupees(totalCurrentVal, currency)}.`,
          date: new Date().toLocaleDateString()
        });
      } else if (growth <= -5) {
        list.push({
          id: 'n-investment-drop',
          type: 'warning',
          message: `📉 Valuation warning: Portfolio holdings are down by ${growth.toFixed(1)}% to ${formatIndianRupees(totalCurrentVal, currency)}.`,
          date: new Date().toLocaleDateString()
        });
      }
    }

    // Merge customNotifications and match read states
    const combined = [...customNotifications, ...list].map(item => ({
      ...item,
      read: item.read || readIds.includes(item.id)
    }));

    setNotifications(combined);
  }, [transactions, budgets, goals, investments, startingBalance, customNotifications, currentUser, isOnboarded, currency]);

  // Auth Operations
  const loginUser = (emailOrPhone, method, name = '') => {
    const user = {
      email: emailOrPhone.includes('@') ? emailOrPhone.toLowerCase() : '',
      phone: emailOrPhone.includes('@') ? '' : emailOrPhone,
      name: name || (emailOrPhone.includes('@') ? emailOrPhone.split('@')[0] : 'User'),
      method
    };
    localStorage.setItem('finovo_current_user', JSON.stringify(user));
    setCurrentUser(user);
    addNotification('success', `Welcome back, ${user.name}! Accessing your dashboard.`);
    return true;
  };

  const signupUser = (emailOrPhone, name, password) => {
    const emailKey = `finovo_auth_${emailOrPhone.toLowerCase()}`;
    localStorage.setItem(emailKey, JSON.stringify({ emailOrPhone, name, password }));
    
    const user = {
      email: emailOrPhone.includes('@') ? emailOrPhone.toLowerCase() : '',
      phone: emailOrPhone.includes('@') ? '' : emailOrPhone,
      name,
      method: 'email'
    };
    localStorage.setItem('finovo_current_user', JSON.stringify(user));
    setCurrentUser(user);
    addNotification('success', `Account created successfully. Welcome to Finovo, ${name}!`);
    return true;
  };

  const logoutUser = () => {
    localStorage.removeItem('finovo_current_user');
    setCurrentUser(null);
    setActivePage('home');
  };

  // Transaction CRUD handlers
  const addTransaction = (t) => {
    const newTx = { ...t, id: `t-${Date.now()}` };
    setTransactions(prev => [newTx, ...prev]);
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
    if (!currentUser) return;
    const newNotif = {
      id: `n-custom-${Date.now()}`,
      type,
      message,
      date: new Date().toLocaleDateString(),
      read: false
    };
    setCustomNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = (id) => {
    if (!currentUser) return;
    const emailOrPhone = currentUser.email || currentUser.phone;
    const readKey = `finovo_user_${emailOrPhone}_read_notifications`;
    const readIds = JSON.parse(localStorage.getItem(readKey) || '[]');
    if (!readIds.includes(id)) {
      const updated = [...readIds, id];
      localStorage.setItem(readKey, JSON.stringify(updated));
      // Trigger a state change to re-evaluate
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }
  };

  const clearAllNotifications = () => {
    if (!currentUser) return;
    const emailOrPhone = currentUser.email || currentUser.phone;
    const readKey = `finovo_user_${emailOrPhone}_read_notifications`;
    const unread = notifications.filter(n => !n.read);
    const readIds = JSON.parse(localStorage.getItem(readKey) || '[]');
    const updated = [...readIds, ...unread.map(n => n.id)];
    localStorage.setItem(readKey, JSON.stringify(updated));
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
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
      addNotification('danger', 'Invalid data format.');
      return false;
    }
  };

  const onboardUser = (data) => {
    const startBal = Number(data.startingBalance) || 0;
    setStartingBalance(startBal);

    const updatedProfile = {
      name: data.name,
      email: data.email || (currentUser.email || 'user@finovo.in'),
      phone: currentUser.phone || '',
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
      currentUser,
      isLoggedIn,
      loginUser,
      signupUser,
      logoutUser,
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

