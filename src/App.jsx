import React, { useContext, useState } from 'react';
import { FinanceContext } from './context/FinanceContext';
import { Icon } from './components/Icon';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ExpenseTracker from './pages/ExpenseTracker';
import BudgetPlanner from './pages/BudgetPlanner';
import Investments from './pages/Investments';
import Goals from './pages/Goals';
import Reports from './pages/Reports';
import Calculators from './pages/Calculators';
import Assistant from './pages/Assistant';
import Settings from './pages/Settings';
import OnboardingWizard from './components/OnboardingWizard';

export const App = () => {
  const { 
    activePage, 
    setActivePage, 
    notifications, 
    markNotificationRead,
    clearAllNotifications,
    profile,
    isOnboarded
  } = useContext(FinanceContext);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  // Auth state simulations
  const [isLoggedIn, setIsLoggedIn] = useState(true); // default logged in to show app immediately
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');

  // Settle unread notifications count
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setIsMobileMenuOpen(false);
  };

  // Nav menu schema
  const menuItems = [
    { id: 'home', label: 'Home', icon: 'Home' },
    { id: 'dashboard', label: 'Dashboard', icon: 'TrendingUp' },
    { id: 'expenses', label: 'Expense Tracker', icon: 'Wallet' },
    { id: 'budget', label: 'Budget Planner', icon: 'Calendar' },
    { id: 'investments', label: 'Investments', icon: 'Activity' },
    { id: 'goals', label: 'Goals', icon: 'Target' },
    { id: 'reports', label: 'Reports', icon: 'PieChart' },
    { id: 'calculators', label: 'Calculators', icon: 'Calculator' },
    { id: 'assistant', label: 'AI Assistant', icon: 'MessageSquare' },
    { id: 'settings', label: 'Settings', icon: 'Settings' }
  ];

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Sticky Premium Nav Header */}
      <header className="sticky top-0 z-40 bg-white/70 dark:bg-navy-darker/80 backdrop-blur-md border-b border-slate-300/20 dark:border-white/5 px-4 md:px-8 py-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Logo Brand */}
          <div 
            onClick={() => setActivePage('home')}
            className="flex items-center space-x-2.5 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald to-gold flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/10 group-hover:scale-105 transition-all">
              <span>F</span>
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 text-transparent bg-clip-text">
              Finovo
            </span>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  activePage === item.id 
                    ? 'bg-emerald/10 text-emerald' 
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-navy-light/40'
                }`}
              >
                <Icon name={item.icon} size={14} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Right Action Tray (Notifications, Profile, Login) */}
          <div className="flex items-center space-x-4">
            
            {/* Smart Notification Bell Icon */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className={`p-2.5 rounded-xl border border-slate-300/20 dark:border-white/5 transition-all relative ${
                  isNotificationOpen ? 'bg-emerald/10 text-emerald' : 'bg-slate-100 dark:bg-navy-light/40 hover:bg-slate-200'
                }`}
              >
                <Icon name="Bell" size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification glassmorphic overlay tray */}
              {isNotificationOpen && (
                <div className="absolute right-0 mt-3 w-80 max-h-[350px] overflow-y-auto glass-panel border border-slate-300/30 dark:border-white/10 shadow-2xl rounded-2xl p-4 z-50 space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-300/15 dark:border-white/5">
                    <span className="font-bold text-xs">Notifications</span>
                    {notifications.length > 0 && (
                      <button 
                        onClick={clearAllNotifications} 
                        className="text-[10px] text-rose-500 font-semibold hover:underline"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  
                  <div className="divide-y divide-slate-300/10 dark:divide-white/5 space-y-2">
                    {notifications.map(n => (
                      <div 
                        key={n.id} 
                        onClick={() => markNotificationRead(n.id)}
                        className={`pt-2 flex items-start gap-2.5 cursor-pointer text-xs ${n.read ? 'opacity-50' : 'font-bold'}`}
                      >
                        <span className="text-emerald mt-0.5">•</span>
                        <div className="space-y-0.5">
                          <p className="text-slate-800 dark:text-slate-200">{n.message}</p>
                          <span className="text-[9px] text-slate-500">{n.date}</span>
                        </div>
                      </div>
                    ))}
                    
                    {notifications.length === 0 && (
                      <p className="text-center py-6 text-xs text-slate-500">No new alerts.</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile / Auth Trigger */}
            {isLoggedIn ? (
              <div 
                onClick={() => setActivePage('settings')}
                className="hidden sm:flex items-center space-x-2 cursor-pointer p-1 pr-3 rounded-xl bg-slate-100 dark:bg-navy-light/40 border border-slate-300/20 dark:border-white/5 hover:border-emerald/40 transition-all select-none"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald text-white flex items-center justify-center font-extrabold text-sm uppercase">
                  {profile.name.substring(0,2)}
                </div>
                <div className="text-left">
                  <span className="block text-[11px] font-bold leading-tight">{profile.name}</span>
                  <span className="block text-[9px] text-slate-500">Gold Tier</span>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="bg-emerald text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-emerald-dark transition-all"
              >
                Login / Register
              </button>
            )}

            {/* Mobile Nav Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 bg-slate-100 dark:bg-navy-light/40 rounded-xl border border-slate-300/20 dark:border-white/5 text-slate-400 hover:text-white"
            >
              <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={18} />
            </button>

          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[70px] z-30 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-panel border-r border-white/5 w-64 h-full p-4 flex flex-col justify-between">
            <nav className="space-y-1">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    activePage === item.id 
                      ? 'bg-emerald/15 text-emerald' 
                      : 'text-slate-400 hover:text-white hover:bg-navy-light/40'
                  }`}
                >
                  <Icon name={item.icon} size={16} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
            <div className="p-2 border-t border-white/5 pt-4">
              <span className="text-[10px] text-slate-500 block">Logged in as {profile.email}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Pages router */}
      <main className="flex-1 w-full bg-slate-50 dark:bg-navy-darker transition-colors duration-300">
        {activePage === 'home' ? (
          <Home />
        ) : !isOnboarded ? (
          <OnboardingWizard />
        ) : (
          <>
            {activePage === 'dashboard' && <Dashboard />}
            {activePage === 'expenses' && <ExpenseTracker />}
            {activePage === 'budget' && <BudgetPlanner />}
            {activePage === 'investments' && <Investments />}
            {activePage === 'goals' && <Goals />}
            {activePage === 'reports' && <Reports />}
            {activePage === 'calculators' && <Calculators />}
            {activePage === 'assistant' && <Assistant />}
            {activePage === 'settings' && <Settings />}
          </>
        )}
      </main>

      {/* Premium Footer */}
      <footer className="bg-white/40 dark:bg-navy-darker/60 border-t border-slate-300/10 dark:border-white/5 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 Finovo Technologies Pvt Ltd. All assets securely stored locally.</p>
          <div className="flex space-x-4">
            <span className="hover:underline cursor-pointer">Security Policy</span>
            <span className="hover:underline cursor-pointer">Terms & Conditions</span>
            <span className="hover:underline cursor-pointer font-bold text-emerald">₹ Indian Standard Numbers</span>
          </div>
        </div>
      </footer>

      {/* Simulated Security Login / Register modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-sm border-emerald/20 p-6 animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold flex items-center space-x-1.5">
                <Icon name="Lock" size={18} className="text-emerald" />
                <span>Secure Entry Portal</span>
              </h3>
              <button onClick={() => setIsLoginModalOpen(false)} className="text-slate-500 hover:text-white">
                <Icon name="X" size={18} />
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-500">Email ID</label>
                <input
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/35 dark:border-white/5 rounded-xl px-4 py-2 text-sm focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-500">Password</label>
                <input
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/35 dark:border-white/5 rounded-xl px-4 py-2 text-sm focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input type="checkbox" id="tfa" className="rounded text-emerald focus:ring-emerald cursor-pointer" />
                <label htmlFor="tfa" className="text-[10px] text-slate-500 cursor-pointer">Simulate 2-Factor Authentication (OTP)</label>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald text-white font-bold py-2 rounded-xl text-sm hover:bg-emerald-dark transition-all mt-4"
              >
                Log In Securely
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
