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
    isOnboarded,
    isLoggedIn,
    currentUser,
    loginUser,
    signupUser,
    logoutUser
  } = useContext(FinanceContext);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  // Auth state details
  const [authTab, setAuthTab] = useState('email'); // 'email' | 'google' | 'phone'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [otpRequested, setOtpRequested] = useState(false);
  const [simulatedOtp, setSimulatedOtp] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [authModalType, setAuthModalType] = useState('login'); // 'login' | 'signup'
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

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

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (authTab === 'email') {
      if (authModalType === 'login') {
        const saved = localStorage.getItem(`finovo_auth_${authEmail.toLowerCase()}`);
        if (saved) {
          const credentials = JSON.parse(saved);
          if (credentials.password === authPassword) {
            loginUser(authEmail, 'email', credentials.name);
            setIsLoginModalOpen(false);
            resetAuthForm();
          } else {
            setErrorMsg('Invalid password. Please try again.');
          }
        } else {
          // Prepopulate bypass for Yogi Patel default
          if (authEmail.toLowerCase() === 'yogi.patel@finovo.in') {
            loginUser(authEmail, 'email', 'Yogi Patel');
            setIsLoginModalOpen(false);
            resetAuthForm();
          } else {
            setErrorMsg('Account not found. Please Sign Up first.');
          }
        }
      } else {
        if (authPassword !== authConfirmPassword) {
          setErrorMsg('Passwords do not match.');
          return;
        }
        signupUser(authEmail, authName, authPassword);
        setIsLoginModalOpen(false);
        resetAuthForm();
      }
    } else if (authTab === 'phone') {
      if (!otpRequested) {
        if (!authPhone || authPhone.length < 8) {
          setErrorMsg('Please enter a valid phone number.');
          return;
        }
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setSimulatedOtp(code);
        setOtpRequested(true);
      } else {
        if (otpInput === simulatedOtp || otpInput === '582094') { // 582094 bypass
          loginUser(authPhone, 'phone', 'Phone User');
          setIsLoginModalOpen(false);
          resetAuthForm();
        } else {
          setErrorMsg('Invalid verification code. Please try again.');
        }
      }
    }
  };

  const handleGoogleLogin = (email, name) => {
    loginUser(email, 'google', name);
    setIsLoginModalOpen(false);
    resetAuthForm();
  };

  const resetAuthForm = () => {
    setAuthEmail('');
    setAuthPassword('');
    setAuthName('');
    setAuthConfirmPassword('');
    setAuthPhone('');
    setOtpRequested(false);
    setSimulatedOtp('');
    setOtpInput('');
    setCustomGoogleEmail('');
    setErrorMsg('');
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
                        <span className={`mt-0.5 w-1.5 h-1.5 rounded-full ${n.type === 'danger' ? 'bg-rose-500' : n.type === 'warning' ? 'bg-yellow-500' : 'bg-emerald'}`}></span>
                        <div className="space-y-0.5">
                          <p className="text-slate-800 dark:text-slate-200 leading-tight">{n.message}</p>
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
              <div className="flex items-center space-x-2">
                <div 
                  onClick={() => setActivePage('settings')}
                  className="hidden sm:flex items-center space-x-2 cursor-pointer p-1 pr-3 rounded-xl bg-slate-100 dark:bg-navy-light/40 border border-slate-300/20 dark:border-white/5 hover:border-emerald/40 transition-all select-none"
                  title={currentUser.email || currentUser.phone}
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald text-white flex items-center justify-center font-extrabold text-sm uppercase">
                    {profile.name ? profile.name.substring(0,2) : 'US'}
                  </div>
                  <div className="text-left">
                    <span className="block text-[11px] font-bold leading-tight truncate max-w-[85px]">{profile.name || 'User'}</span>
                    <span className="block text-[9px] text-slate-500 capitalize">{currentUser.method} User</span>
                  </div>
                </div>
                <button
                  onClick={logoutUser}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-navy-light/40 hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 border border-slate-300/20 dark:border-white/5 transition-all"
                  title="Log Out"
                >
                  <Icon name="LogOut" size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => { setAuthModalType('login'); setIsLoginModalOpen(true); }}
                  className="bg-slate-100 dark:bg-navy-light/40 hover:bg-slate-200 border border-slate-300/20 dark:border-white/5 text-slate-800 dark:text-white text-xs font-bold px-3 py-2.5 rounded-xl transition-all"
                >
                  Log In
                </button>
                <button 
                  onClick={() => { setAuthModalType('signup'); setIsLoginModalOpen(true); }}
                  className="bg-emerald text-white text-xs font-bold px-3 py-2.5 rounded-xl hover:bg-emerald-dark hover:scale-[1.02] shadow-lg shadow-emerald-500/10 transition-all"
                >
                  Sign Up
                </button>
              </div>
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
              {isLoggedIn ? (
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-500 block truncate">Logged in as {currentUser.email || currentUser.phone}</span>
                  <button 
                    onClick={logoutUser}
                    className="w-full text-left text-xs font-bold text-rose-500 flex items-center space-x-1.5 py-1"
                  >
                    <Icon name="LogOut" size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <span className="text-[10px] text-slate-500 block">Not authenticated</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Pages router */}
      <main className="flex-1 w-full bg-slate-50 dark:bg-navy-darker transition-colors duration-300">
        {activePage === 'home' ? (
          <Home />
        ) : !isLoggedIn && activePage !== 'calculators' ? (
          <div className="max-w-md mx-auto py-20 px-4">
            <div className="glass-panel border-rose-500/20 p-8 text-center space-y-6 animate-in zoom-in duration-200">
              <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/5">
                <Icon name="Lock" size={28} />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold tracking-tight">Authentication Required</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Finovo secures all your financial changes (ledger, budgets, investments, goals) under your personal encrypted local vault.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => { setAuthModalType('login'); setIsLoginModalOpen(true); }}
                  className="flex-1 bg-slate-200 dark:bg-navy-light text-slate-800 dark:text-white font-bold py-3 rounded-xl text-xs hover:bg-slate-300 dark:hover:bg-slate-800 transition-all"
                >
                  Log In
                </button>
                <button
                  onClick={() => { setAuthModalType('signup'); setIsLoginModalOpen(true); }}
                  className="flex-1 bg-emerald text-white font-bold py-3 rounded-xl text-xs hover:bg-emerald-dark hover:scale-[1.01] transition-all"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
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

      {/* Premium Multi-Method Auth Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md border-emerald/20 p-6 animate-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-300/15 dark:border-white/5">
              <h3 className="text-lg font-bold flex items-center space-x-2">
                <Icon name="Lock" size={18} className="text-emerald" />
                <span>{authModalType === 'login' ? 'Secure Entry Portal' : 'Create Free Account'}</span>
              </h3>
              <button 
                onClick={() => { setIsLoginModalOpen(false); resetAuthForm(); }}
                className="text-slate-500 hover:text-white transition-colors p-1"
              >
                <Icon name="X" size={18} />
              </button>
            </div>

            {/* Tab Swappers */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-navy-dark rounded-xl mb-6 border border-slate-300/15 dark:border-white/5">
              <button
                type="button"
                onClick={() => { setAuthTab('email'); setErrorMsg(''); }}
                className={`flex items-center justify-center space-x-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  authTab === 'email' 
                    ? 'bg-white dark:bg-navy-light text-slate-900 dark:text-white shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <Icon name="Mail" size={13} />
                <span>Email</span>
              </button>
              
              <button
                type="button"
                onClick={() => { setAuthTab('google'); setErrorMsg(''); }}
                className={`flex items-center justify-center space-x-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  authTab === 'google' 
                    ? 'bg-white dark:bg-navy-light text-slate-900 dark:text-white shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <Icon name="Chrome" size={13} />
                <span>Google</span>
              </button>
              
              <button
                type="button"
                onClick={() => { setAuthTab('phone'); setErrorMsg(''); }}
                className={`flex items-center justify-center space-x-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  authTab === 'phone' 
                    ? 'bg-white dark:bg-navy-light text-slate-900 dark:text-white shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <Icon name="Smartphone" size={13} />
                <span>Phone OTP</span>
              </button>
            </div>

            {/* Error Message Display */}
            {errorMsg && (
              <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-medium flex items-center space-x-2">
                <Icon name="AlertTriangle" size={14} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Auth Tab Contents */}
            <form onSubmit={handleAuthSubmit}>
              
              {/* 1. EMAIL TAB */}
              {authTab === 'email' && (
                <div className="space-y-4">
                  {authModalType === 'signup' && (
                    <div className="space-y-1">
                      <label className="text-xs text-slate-500">Your Full Name</label>
                      <input
                        type="text"
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        placeholder="Yogi Patel"
                        className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/35 dark:border-white/5 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-emerald font-medium"
                        required
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs text-slate-500">Email Address</label>
                    <input
                      type="email"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="name@email.com"
                      className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/35 dark:border-white/5 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-emerald font-medium"
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
                      className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/35 dark:border-white/5 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-emerald font-medium"
                      required
                    />
                  </div>

                  {authModalType === 'signup' && (
                    <div className="space-y-1">
                      <label className="text-xs text-slate-500">Confirm Password</label>
                      <input
                        type="password"
                        value={authConfirmPassword}
                        onChange={(e) => setAuthConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/35 dark:border-white/5 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-emerald font-medium"
                        required
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-emerald text-white font-bold py-2.5 rounded-xl text-xs hover:bg-emerald-dark transition-all mt-6 flex items-center justify-center space-x-1.5 shadow-lg shadow-emerald-500/10"
                  >
                    <span>{authModalType === 'login' ? 'Log In Securely' : 'Sign Up Free'}</span>
                    <Icon name="ArrowRight" size={14} />
                  </button>

                  <p className="text-center text-[10px] text-slate-500 pt-3">
                    {authModalType === 'login' ? (
                      <>
                        Don't have an account?{' '}
                        <button 
                          type="button" 
                          onClick={() => { setAuthModalType('signup'); setErrorMsg(''); }}
                          className="text-emerald hover:underline font-bold"
                        >
                          Sign Up
                        </button>
                      </>
                    ) : (
                      <>
                        Already have an account?{' '}
                        <button 
                          type="button" 
                          onClick={() => { setAuthModalType('login'); setErrorMsg(''); }}
                          className="text-emerald hover:underline font-bold"
                        >
                          Log In
                        </button>
                      </>
                    )}
                  </p>
                </div>
              )}

              {/* 2. GOOGLE TAB */}
              {authTab === 'google' && (
                <div className="space-y-4">
                  <p className="text-[11px] text-slate-500 leading-relaxed text-center">
                    Select a Google Account to sign in instantly (simulated secure OAuth flow):
                  </p>

                  <div className="space-y-2 pt-2">
                    <button
                      type="button"
                      onClick={() => handleGoogleLogin('yogi.patel@gmail.com', 'Yogi Patel')}
                      className="w-full flex items-center space-x-3 p-3 bg-slate-100 dark:bg-navy-dark hover:bg-slate-200 dark:hover:bg-navy-light/60 border border-slate-300/20 dark:border-white/5 rounded-2xl text-left transition-all"
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm">
                        Y
                      </div>
                      <div>
                        <span className="block font-bold text-xs">Yogi Patel</span>
                        <span className="block text-[10px] text-slate-500">yogi.patel@gmail.com</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleGoogleLogin('nilkanth.patel@gmail.com', 'Nilkanth Patel')}
                      className="w-full flex items-center space-x-3 p-3 bg-slate-100 dark:bg-navy-dark hover:bg-slate-200 dark:hover:bg-navy-light/60 border border-slate-300/20 dark:border-white/5 rounded-2xl text-left transition-all"
                    >
                      <div className="w-8 h-8 rounded-full bg-emerald text-white flex items-center justify-center font-bold text-sm">
                        N
                      </div>
                      <div>
                        <span className="block font-bold text-xs">Nilkanth Patel</span>
                        <span className="block text-[10px] text-slate-500">nilkanth.patel@gmail.com</span>
                      </div>
                    </button>
                  </div>

                  <div className="pt-4 border-t border-slate-300/10 dark:border-white/5 space-y-2">
                    <label className="text-xs text-slate-500 block">Or connect a different Google account:</label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={customGoogleEmail}
                        onChange={(e) => setCustomGoogleEmail(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="flex-1 bg-slate-100 dark:bg-navy-dark border border-slate-300/35 dark:border-white/5 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-emerald"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customGoogleEmail.includes('@')) {
                            handleGoogleLogin(customGoogleEmail, customGoogleEmail.split('@')[0]);
                          } else {
                            setErrorMsg('Please enter a valid Google email address.');
                          }
                        }}
                        className="bg-emerald hover:bg-emerald-dark text-white text-xs font-bold px-3 py-2 rounded-xl transition-all"
                      >
                        Connect
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. PHONE OTP TAB */}
              {authTab === 'phone' && (
                <div className="space-y-4">
                  {!otpRequested ? (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-500">Phone Number</label>
                        <div className="flex gap-2">
                          <select className="bg-slate-100 dark:bg-navy-dark border border-slate-300/35 dark:border-white/5 rounded-xl px-2.5 py-2 text-xs focus:outline-none">
                            <option>+91 (IN)</option>
                            <option>+1 (US)</option>
                            <option>+44 (UK)</option>
                          </select>
                          <input
                            type="tel"
                            value={authPhone}
                            onChange={(e) => setAuthPhone(e.target.value)}
                            placeholder="98765 43210"
                            className="flex-1 bg-slate-100 dark:bg-navy-dark border border-slate-300/35 dark:border-white/5 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-emerald font-semibold"
                            required
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-emerald text-white font-bold py-2.5 rounded-xl text-xs hover:bg-emerald-dark transition-all mt-4 flex items-center justify-center space-x-1 shadow-lg shadow-emerald-500/10"
                      >
                        <span>Request Verification Code</span>
                        <Icon name="ShieldAlert" size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Debug OTP Banner Mockup */}
                      <div className="p-3 bg-emerald/10 border border-emerald/20 text-emerald rounded-xl text-[11px] font-medium flex items-center justify-between">
                        <span>📲 Simulated SMS OTP code sent:</span>
                        <span className="font-extrabold text-sm tracking-wider font-mono bg-white dark:bg-navy-dark px-2 py-0.5 rounded shadow-sm border border-emerald/20">{simulatedOtp}</span>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-slate-500">Enter 6-Digit OTP</label>
                        <input
                          type="text"
                          maxLength="6"
                          value={otpInput}
                          onChange={(e) => setOtpInput(e.target.value)}
                          placeholder="e.g. 582094"
                          className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/35 dark:border-white/5 rounded-xl px-4 py-3 text-center text-lg tracking-widest font-mono font-extrabold focus:outline-none focus:border-emerald"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-emerald text-white font-bold py-2.5 rounded-xl text-xs hover:bg-emerald-dark transition-all mt-4"
                      >
                        Verify & Access Vault
                      </button>

                      <div className="text-center pt-2 flex justify-between text-[10px] text-slate-500">
                        <button 
                          type="button" 
                          onClick={() => {
                            const code = Math.floor(100000 + Math.random() * 900000).toString();
                            setSimulatedOtp(code);
                            setErrorMsg('');
                          }} 
                          className="text-emerald hover:underline font-semibold"
                        >
                          Resend Code
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setOtpRequested(false)} 
                          className="hover:underline"
                        >
                          Change Number
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
