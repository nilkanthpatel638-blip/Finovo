import React, { useContext, useState } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { GlassPanel } from '../components/GlassPanel';
import { Icon } from '../components/Icon';
import { exportToCSV, exportToJSON } from '../utils/financeUtils';

export const Settings = () => {
  const {
    profile,
    setProfile,
    theme,
    setTheme,
    currency,
    setCurrency,
    transactions,
    budgets,
    goals,
    investments,
    categories,
    restoreBackup,
    addNotification
  } = useContext(FinanceContext);

  // Profile forms state
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [timezone, setTimezone] = useState(profile.timezone || 'IST (UTC+5:30)');
  const [backupText, setBackupText] = useState('');

  // Password mockup state
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleProfileSave = (e) => {
    e.preventDefault();
    setProfile({
      ...profile,
      name,
      email,
      timezone
    });
    addNotification('success', 'Profile settings updated successfully.');
  };

  // Export all database state to JSON backup file
  const handleExportBackup = () => {
    const fullBackup = {
      profile,
      transactions,
      budgets,
      goals,
      investments,
      categories
    };
    exportToJSON(fullBackup, `finovo_backup_${new Date().toISOString().substring(0, 10)}`);
    addNotification('success', 'Backup exported successfully.');
  };

  // Restore database state from JSON string paste
  const handleImportBackup = (e) => {
    e.preventDefault();
    if (!backupText.trim()) return;

    const success = restoreBackup(backupText.trim());
    if (success) {
      setBackupText('');
    }
  };

  // Export transactions ledger as CSV/Excel
  const handleExportCSV = () => {
    const headers = ['ID', 'Type', 'Amount', 'Category', 'Date', 'Notes', 'PaymentMethod'];
    const rows = transactions.map(t => [
      t.id,
      t.type,
      t.amount,
      t.category,
      t.date,
      t.notes || '',
      t.paymentMethod
    ]);
    exportToCSV(headers, rows, `finovo_transactions_${new Date().toISOString().substring(0, 10)}`);
  };

  // Export investments ledger as CSV
  const handleExportInvestmentsCSV = () => {
    const headers = ['Name', 'AssetClass', 'InvestedCapital', 'CurrentValuation', 'SIPAmount'];
    const rows = investments.map(i => [
      i.name,
      i.type,
      i.investedAmount,
      i.currentValue,
      i.sipAmount
    ]);
    exportToCSV(headers, rows, `finovo_investments_${new Date().toISOString().substring(0, 10)}`);
  };

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">System Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Configure your profile, theme settings, backup records, and export files.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Profile, Password & Theme settings */}
        <div className="lg:col-span-8 space-y-6">
          {/* Profile Form */}
          <GlassPanel className="space-y-6">
            <h3 className="text-lg font-bold flex items-center space-x-2">
              <Icon name="User" className="text-emerald" />
              <span>User Profile</span>
            </h3>

            <form onSubmit={handleProfileSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-500">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 dark:border-white/5 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-500">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 dark:border-white/5 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-500">Currency Symbol</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 dark:border-white/5 rounded-xl px-3 py-2 text-sm focus:outline-none cursor-pointer"
                >
                  <option value="₹">Indian Rupee (₹)</option>
                  <option value="$">US Dollar ($)</option>
                  <option value="€">Euro (€)</option>
                  <option value="£">Pound (£)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-500">Timezone</label>
                <input
                  type="text"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-navy-dark border border-slate-300/30 dark:border-white/5 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald"
                />
              </div>

              <div className="sm:col-span-2 pt-2">
                <button
                  type="submit"
                  className="bg-emerald text-white px-6 py-2 rounded-xl text-xs font-semibold hover:bg-emerald-dark transition-colors"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </GlassPanel>

          {/* Theme Preferences */}
          <GlassPanel className="space-y-6">
            <h3 className="text-lg font-bold flex items-center space-x-2">
              <Icon name="Tv" className="text-gold" />
              <span>Theme Preferences</span>
            </h3>

            <div className="flex gap-4">
              <button
                onClick={() => setTheme('dark')}
                className={`flex-1 p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                  theme === 'dark'
                    ? 'bg-navy-light border-emerald text-emerald font-bold'
                    : 'bg-slate-100/50 dark:bg-navy-dark/40 border-slate-300/10 dark:border-white/5 text-slate-400'
                }`}
              >
                <Icon name="Moon" size={24} />
                <span className="text-xs">Deep Navy (Dark Mode)</span>
              </button>

              <button
                onClick={() => setTheme('light')}
                className={`flex-1 p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                  theme === 'light'
                    ? 'bg-white border-emerald text-emerald font-bold'
                    : 'bg-slate-100/50 dark:bg-navy-dark/40 border-slate-300/10 dark:border-white/5 text-slate-400'
                }`}
              >
                <Icon name="Sun" size={24} />
                <span className="text-xs">Ice White (Light Mode)</span>
              </button>
            </div>
          </GlassPanel>
        </div>

        {/* Right Side: Backups, Exporting, System Restore */}
        <div className="lg:col-span-4 space-y-6">
          {/* Export Data */}
          <GlassPanel className="space-y-4">
            <h3 className="text-base font-bold flex items-center space-x-2">
              <Icon name="Download" className="text-blue-500" />
              <span>Export Ledgers</span>
            </h3>
            
            <p className="text-xs text-slate-500 leading-relaxed">
              Export data formats. Transactions and portfolio files compile client-side instantly.
            </p>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleExportCSV}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-100 dark:bg-navy-dark/60 border border-slate-300/25 dark:border-white/5 rounded-xl text-xs hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                <span className="font-semibold">Export Transactions (CSV)</span>
                <Icon name="FileText" size={14} className="text-emerald" />
              </button>

              <button
                onClick={handleExportInvestmentsCSV}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-100 dark:bg-navy-dark/60 border border-slate-300/25 dark:border-white/5 rounded-xl text-xs hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                <span className="font-semibold">Export Portfolio (CSV)</span>
                <Icon name="TrendingUp" size={14} className="text-gold" />
              </button>

              <button
                onClick={handleExportBackup}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-100 dark:bg-navy-dark/60 border border-slate-300/25 dark:border-white/5 rounded-xl text-xs hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                <span className="font-semibold">Backup full database (JSON)</span>
                <Icon name="Download" size={14} className="text-blue-500" />
              </button>
            </div>
          </GlassPanel>

          {/* Backup Restore */}
          <GlassPanel className="space-y-4">
            <h3 className="text-base font-bold flex items-center space-x-2">
              <Icon name="Upload" className="text-purple-500" />
              <span>Restore Database</span>
            </h3>

            <form onSubmit={handleImportBackup} className="space-y-3">
              <p className="text-xs text-slate-500 leading-relaxed">
                Paste contents of exported JSON file to recover portfolio states.
              </p>
              
              <textarea
                value={backupText}
                onChange={(e) => setBackupText(e.target.value)}
                placeholder='{"profile": {...}, "transactions": [...] ...}'
                rows="4"
                className="w-full bg-slate-100 dark:bg-navy-dark/60 border border-slate-300/30 dark:border-white/5 rounded-xl p-3 text-[10px] font-mono focus:outline-none focus:border-emerald"
                required
              />

              <button
                type="submit"
                className="w-full bg-purple-500 text-white font-bold py-2 rounded-xl text-xs hover:bg-purple-600 transition-colors"
              >
                Restore Backup
              </button>
            </form>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
};

export default Settings;
