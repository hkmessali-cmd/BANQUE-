import React, { useState } from 'react';
import { useBanking } from '../context/BankingContext';
import { SavingsVault, Currency } from '../types/banking';
import { formatCurrency } from '../utils/formatters';
import {
  PiggyBank,
  Plus,
  Lock,
  Unlock,
  TrendingUp,
  Sparkles,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  Coins,
} from 'lucide-react';

export const SavingsHub: React.FC = () => {
  const {
    lang,
    t,
    vaults,
    accounts,
    createVault,
    depositToVault,
    withdrawFromVault,
    toggleAutoRoundUp,
  } = useBanking();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedVaultForAction, setSelectedVaultForAction] = useState<SavingsVault | null>(null);
  const [actionType, setActionType] = useState<'deposit' | 'withdraw'>('deposit');
  const [actionAmount, setActionAmount] = useState<number>(10000);

  // New Vault form state
  const [newVaultName, setNewVaultName] = useState('');
  const [newVaultCategory, setNewVaultCategory] = useState<'car' | 'hajj' | 'emergency' | 'house' | 'general' | 'tech'>('general');
  const [newVaultTarget, setNewVaultTarget] = useState<number>(500000);
  const [newVaultCurrency, setNewVaultCurrency] = useState<Currency>('DZD');
  const [newVaultDeadline, setNewVaultDeadline] = useState('2027-01-01');
  const [newVaultLocked, setNewVaultLocked] = useState(false);

  const totalSavedDZD = vaults.reduce((acc, v) => {
    if (v.currency === 'DZD') return acc + v.currentAmount;
    if (v.currency === 'EUR') return acc + v.currentAmount * 146.5;
    return acc;
  }, 0);

  const totalProfitsDZD = vaults.reduce((acc, v) => {
    if (v.currency === 'DZD') return acc + v.accruedProfit;
    if (v.currency === 'EUR') return acc + v.accruedProfit * 146.5;
    return acc;
  }, 0);

  const handleOpenAction = (vault: SavingsVault, type: 'deposit' | 'withdraw') => {
    setSelectedVaultForAction(vault);
    setActionType(type);
    setActionAmount(vault.currency === 'DZD' ? 10000 : 100);
  };

  const handleActionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVaultForAction || actionAmount <= 0) return;

    if (actionType === 'deposit') {
      const ok = depositToVault(selectedVaultForAction.id, actionAmount);
      if (ok) setSelectedVaultForAction(null);
    } else {
      const ok = withdrawFromVault(selectedVaultForAction.id, actionAmount);
      if (ok) setSelectedVaultForAction(null);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createVault({
      name: newVaultName || 'New Savings Goal',
      nameAr: newVaultName || 'هدف ادخاري جديد',
      category: newVaultCategory,
      targetAmount: Number(newVaultTarget),
      currency: newVaultCurrency,
      deadlineDate: newVaultDeadline,
      isLocked: newVaultLocked,
      profitRateAnnual: 4.8,
      autoRoundUp: true,
      color: '#10b981',
    });
    setIsCreateModalOpen(false);
    setNewVaultName('');
  };

  return (
    <div className="space-y-8">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">{t.savingsTitle}</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">{t.savingsSubtitle}</p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition-colors shadow-lg shadow-emerald-950/40"
        >
          <Plus className="h-4 w-4" />
          <span>{t.createNewVault}</span>
        </button>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{t.totalSavings}</span>
            <PiggyBank className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white tabular-nums tracking-tight">
            {formatCurrency(totalSavedDZD, 'DZD', lang)}
          </div>
          <div className="mt-1 text-[11px] text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" />
            <span>{lang === 'ar' ? 'مضمونة ومفصولة بنكياً' : 'Capital protected & insured'}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{t.accruedProfits}</span>
            <TrendingUp className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-400 tabular-nums tracking-tight">
            +{formatCurrency(totalProfitsDZD, 'DZD', lang)}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            {lang === 'ar' ? 'أرباح مضاربة إسلامية متوافقة' : 'Mudaraba Sharia profit share'}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{t.autoRoundUpTitle}</span>
            <Coins className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-xs text-slate-300 mt-2">
            {t.autoRoundUpDesc}
          </div>
          <div className="mt-3 text-[11px] font-semibold text-emerald-400">
            {lang === 'ar' ? 'مفعلة تلقائياً لجميع البطاقات' : 'Active for all cards'}
          </div>
        </div>
      </div>

      {/* Vaults Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vaults.map((vault) => {
          const progressPercent = Math.min(
            100,
            Math.round((vault.currentAmount / vault.targetAmount) * 100)
          );

          return (
            <div
              key={vault.id}
              className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                {/* Vault Top */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white">
                      {lang === 'ar' ? vault.nameAr : vault.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>{vault.profitRateAnnual}% {lang === 'ar' ? 'ربح سنوي' : 'p.a. yield'}</span>
                      {vault.deadlineDate && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {vault.deadlineDate}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div
                    className="p-2 rounded-xl bg-slate-800 border border-slate-700"
                    title={vault.isLocked ? (lang === 'ar' ? 'مقفل حتى بلوغ التاريخ' : 'Locked until target date') : (lang === 'ar' ? 'سحب مرن متاح' : 'Flexible withdrawals')}
                  >
                    {vault.isLocked ? (
                      <Lock className="h-4 w-4 text-amber-400" />
                    ) : (
                      <Unlock className="h-4 w-4 text-emerald-400" />
                    )}
                  </div>
                </div>

                {/* Amount and Target */}
                <div>
                  <div className="text-2xl font-bold text-white tabular-nums tracking-tight">
                    {formatCurrency(vault.currentAmount, vault.currency, lang)}
                  </div>
                  <div className="text-xs text-slate-400 flex items-center justify-between mt-1">
                    <span>{t.targetAmount}: {formatCurrency(vault.targetAmount, vault.currency, lang)}</span>
                    <span className="font-mono font-bold text-emerald-400">{progressPercent}%</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Auto Round Up Toggle */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-400">{lang === 'ar' ? 'ادخار الفكة الآلي' : 'Spare Change'}</span>
                  <button
                    onClick={() => toggleAutoRoundUp(vault.id)}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                      vault.autoRoundUp
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {vault.autoRoundUp ? (lang === 'ar' ? 'مفعل' : 'On') : (lang === 'ar' ? 'معطل' : 'Off')}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => handleOpenAction(vault, 'deposit')}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  <ArrowDownLeft className="h-3.5 w-3.5" />
                  <span>{t.depositToVault}</span>
                </button>
                <button
                  onClick={() => handleOpenAction(vault, 'withdraw')}
                  disabled={vault.isLocked || vault.currentAmount <= 0}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
                >
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  <span>{t.withdrawFromVault}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deposit / Withdraw Action Modal */}
      {selectedVaultForAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">
              {actionType === 'deposit' ? t.depositToVault : t.withdrawFromVault}
            </h3>
            <p className="text-xs text-slate-400">
              {lang === 'ar'
                ? `الخزنة: ${selectedVaultForAction.nameAr} (${selectedVaultForAction.currency})`
                : `Vault: ${selectedVaultForAction.name} (${selectedVaultForAction.currency})`}
            </p>

            <form onSubmit={handleActionSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-300">{lang === 'ar' ? 'المبلغ' : 'Amount'}</label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    required
                    value={actionAmount}
                    onChange={(e) => setActionAmount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono tabular-nums focus:outline-none focus:border-emerald-500"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">
                    {selectedVaultForAction.currency}
                  </span>
                </div>
              </div>

              {/* Quick Amount Chips */}
              <div className="flex gap-2">
                {[5000, 20000, 50000].map((quick) => (
                  <button
                    key={quick}
                    type="button"
                    onClick={() => setActionAmount(quick)}
                    className="flex-1 py-1 text-[11px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                  >
                    +{quick}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedVaultForAction(null)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs"
                >
                  {t.confirm}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create New Vault Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white">{t.createNewVault}</h2>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-300">{lang === 'ar' ? 'اسم الخزنة أو الهدف' : 'Goal Name'}</label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'ar' ? 'مثال: شراء سيارة، زواج، سفر، حج...' : 'e.g. Dream House, Umrah trip...'}
                  value={newVaultName}
                  onChange={(e) => setNewVaultName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">{t.targetAmount}</label>
                  <input
                    type="number"
                    min={100}
                    required
                    value={newVaultTarget}
                    onChange={(e) => setNewVaultTarget(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-300">{t.selectCurrency}</label>
                  <select
                    value={newVaultCurrency}
                    onChange={(e) => setNewVaultCurrency(e.target.value as Currency)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="DZD">DZD (دينار جزائري)</option>
                    <option value="EUR">EUR (€ يورو)</option>
                    <option value="USD">USD ($ دولار)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300">{lang === 'ar' ? 'تاريخ الهدف المستهدف' : 'Target Date'}</label>
                <input
                  type="date"
                  value={newVaultDeadline}
                  onChange={(e) => setNewVaultDeadline(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <input
                  type="checkbox"
                  id="lockCheckbox"
                  checked={newVaultLocked}
                  onChange={(e) => setNewVaultLocked(e.target.checked)}
                  className="accent-emerald-500"
                />
                <label htmlFor="lockCheckbox" className="text-slate-300 cursor-pointer">
                  {lang === 'ar' ? 'قفل الخزنة حتى بلوغ التاريخ المستهدف (انضباط ادخاري)' : 'Lock vault until target date for discipline'}
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs"
                >
                  {t.confirm}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
