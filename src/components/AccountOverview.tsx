import React, { useState } from 'react';
import { useBanking } from '../context/BankingContext';
import { formatCurrency } from '../utils/formatters';
import {
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  CreditCard,
  FileText,
  Copy,
  Check,
  TrendingUp,
  ShieldCheck,
  Building2,
  Search,
  Filter,
  ExternalLink,
} from 'lucide-react';

export const AccountOverview: React.FC = () => {
  const {
    lang,
    t,
    accounts,
    selectedAccountId,
    setSelectedAccountId,
    currentAccount,
    transactions,
    exchangeRates,
    setActiveTab,
    setIsExchangeOpen,
    setIsStatementOpen,
    setIsIssueCardOpen,
    totalNetWorthDZD,
    addToast,
  } = useBanking();

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'debit' | 'credit' | 'shopping' | 'transfer'>('all');

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    addToast(t.copySuccess, text, 'info');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.titleAr.includes(searchQuery) ||
      (tx.merchant && tx.merchant.toLowerCase().includes(searchQuery.toLowerCase())) ||
      tx.reference.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'debit') return tx.type === 'debit';
    if (selectedFilter === 'credit') return tx.type === 'credit';
    if (selectedFilter === 'shopping') return tx.category === 'shopping';
    if (selectedFilter === 'transfer') return tx.category === 'transfer';
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Top Banner / Net Worth Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-sm">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{lang === 'ar' ? 'حساب بنكي نشط ومحمي بضمان البنك المركزي' : 'Verified & Insured Digital Bank Account'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {lang === 'ar' ? 'أهلاً بك في فضاءك المصرفي' : 'Welcome to your Financial Space'}
            </h1>
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tabular-nums tracking-tight">
                {formatCurrency(totalNetWorthDZD, 'DZD', lang)}
              </span>
              <span className="text-sm font-medium text-slate-400">
                (≈ {formatCurrency(totalNetWorthDZD / 146.5, 'EUR', lang)})
              </span>
            </div>
            <p className="text-xs text-slate-400 pt-1">
              {t.totalNetWorth} {lang === 'ar' ? 'تشمل الأرصدة متعددة العملات، الذهب، والصناديق الاستثمارية' : 'combines all multi-currency accounts, gold vault & investments'}
            </p>
          </div>

          {/* Quick Primary Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              onClick={() => setActiveTab('transfers')}
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-colors shadow-sm"
            >
              <ArrowUpRight className="h-5 w-5" />
              <span>{t.sendMoney}</span>
            </button>
            <button
              onClick={() => setIsExchangeOpen(true)}
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors"
            >
              <RefreshCw className="h-5 w-5 text-emerald-400" />
              <span>{t.exchangeCurrency}</span>
            </button>
            <button
              onClick={() => setIsIssueCardOpen(true)}
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors"
            >
              <CreditCard className="h-5 w-5 text-amber-400" />
              <span>{t.issueNewCard}</span>
            </button>
            <button
              onClick={() => setIsStatementOpen(true)}
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors"
            >
              <FileText className="h-5 w-5 text-blue-400" />
              <span>{t.viewStatement}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Multi-Currency Balances Selector */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white tracking-tight">{t.availableBalances}</h2>
          <div className="text-xs text-slate-400">
            <span>{accounts.length} {lang === 'ar' ? 'حسابات دولية ومحلية' : 'active currency accounts'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {accounts.map((acc) => {
            const isSelected = acc.id === selectedAccountId;
            return (
              <div
                key={acc.id}
                onClick={() => setSelectedAccountId(acc.id)}
                className={`cursor-pointer rounded-xl p-5 border transition-all ${
                  isSelected
                    ? 'bg-slate-900 border-emerald-500/70 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500/30'
                    : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-black ${
                        acc.currency === 'DZD'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : acc.currency === 'EUR'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {acc.currency}
                    </span>
                    <span className="text-xs font-medium text-slate-400">
                      {lang === 'ar' ? acc.nameAr : acc.name}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded">
                      {lang === 'ar' ? 'الحساب المحدد' : 'Active'}
                    </span>
                  )}
                </div>

                <div className="mt-4">
                  <div className="text-2xl font-bold text-white tabular-nums tracking-tight">
                    {formatCurrency(acc.balance, acc.currency, lang)}
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
                    <span className="truncate max-w-[190px]">
                      {acc.currency === 'DZD' ? `RIB: ${acc.rib.slice(0, 10)}...` : acc.iban || acc.accountNumber}
                    </span>
                    <span className="text-emerald-400 font-medium">
                      {lang === 'ar' ? 'فوري ومجاني' : 'Instant'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Account Details & Routing / Official Banking IDs */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="h-4 w-4 text-emerald-400" />
              <span>{t.accountDetails}</span>
              <span className="text-xs font-normal text-slate-400">
                ({currentAccount.currency})
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'ar'
                ? 'استخدم هذه البيانات لاستقبال التحويلات من بريدي موب، البنوك الجزائرية، أو التحويلات الدولية'
                : 'Use these official coordinates to receive payments locally in Algeria or from international clients'}
            </p>
          </div>
          <button
            onClick={() => setIsStatementOpen(true)}
            className="self-start sm:self-auto text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>{t.viewStatement}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* Algerian RIB / BaridiMob RIP */}
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400">
              <span>{lang === 'ar' ? 'رقم الحساب البريدي / البنكي (RIB / RIP)' : 'Algerian RIP / RIB (20 digits)'}</span>
              <button
                onClick={() => copyToClipboard(currentAccount.rib, 'rib')}
                className="text-slate-400 hover:text-emerald-400 p-1"
                title="Copy"
              >
                {copiedField === 'rib' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
            <div className="font-mono text-slate-200 font-medium tracking-wider">
              {currentAccount.rib}
            </div>
            <div className="text-[11px] text-slate-400">
              {lang === 'ar' ? 'متوافق تماماً مع تطبيق بريدي موب BaridiMob وجميع بنوك الجزائر' : 'Fully compatible with BaridiMob & CIB interbank routing'}
            </div>
          </div>

          {/* European IBAN / International */}
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400">
              <span>{lang === 'ar' ? 'الآيبان الدولي (IBAN)' : 'International IBAN'}</span>
              <button
                onClick={() => copyToClipboard(currentAccount.iban || currentAccount.accountNumber, 'iban')}
                className="text-slate-400 hover:text-emerald-400 p-1"
                title="Copy"
              >
                {copiedField === 'iban' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
            <div className="font-mono text-slate-200 font-medium tracking-wider">
              {currentAccount.iban || currentAccount.accountNumber}
            </div>
            <div className="text-[11px] text-slate-400">
              {lang === 'ar' ? 'لاستقبال أرباح العمل الحر، Upwork، Stripe، وشركات أوروبا' : 'Accepts SEPA transfers, freelance payouts & international wire'}
            </div>
          </div>

          {/* SWIFT / BIC */}
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400">
              <span>{lang === 'ar' ? 'رمز السويفت الدولي (BIC / SWIFT)' : 'Bank BIC / SWIFT Code'}</span>
              <button
                onClick={() => copyToClipboard(currentAccount.bicSwift, 'bic')}
                className="text-slate-400 hover:text-emerald-400 p-1"
                title="Copy"
              >
                {copiedField === 'bic' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
            <div className="font-mono text-slate-200 font-medium tracking-wider">
              {currentAccount.bicSwift}
            </div>
            <div className="text-[11px] text-slate-400">
              {lang === 'ar' ? 'الفرع المركزي: الجزائر العاصمة - نوميديا للخدمات البنكية الرقمية' : 'Headquarters: Algiers, Numidia Bank International'}
            </div>
          </div>
        </div>
      </section>

      {/* Live Algerian & International Currency Rates */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/30 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <span>{lang === 'ar' ? 'مؤشرات أسعار الصرف الحية في الجزائر' : 'Live Algerian Currency & Exchange Rates'}</span>
            </h3>
            <p className="text-xs text-slate-400">
              {lang === 'ar' ? 'مقارنة شفافة بين سعر الصرف البنكي الرسمي والمؤشر المرجعي للسوق' : 'Transparent benchmark comparison between official Bank of Algeria & market rates'}
            </p>
          </div>
          <button
            onClick={() => setIsExchangeOpen(true)}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>{t.exchangeCurrency}</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {exchangeRates.map((fx) => (
            <div
              key={fx.pair}
              className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800/80 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white">{fx.pair}</span>
                <span className={`text-xs font-mono font-medium ${fx.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {fx.change24h >= 0 ? `+${fx.change24h}%` : `${fx.change24h}%`}
                </span>
              </div>
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">{lang === 'ar' ? 'السعر البنكي' : 'Bank Rate'}:</span>
                  <span className="font-mono font-semibold text-slate-200 tabular-nums">
                    {fx.rate} {fx.pair.includes('DZD') ? 'د.ج' : ''}
                  </span>
                </div>
                {fx.marketRate && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">{lang === 'ar' ? 'مؤشر السكوار' : 'Market Ref'}:</span>
                    <span className="font-mono font-semibold text-amber-400 tabular-nums">
                      {fx.marketRate} د.ج
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Transactions List with Search & Filtering */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white">{t.recentTransactions}</h3>
            <p className="text-xs text-slate-400">
              {lang === 'ar' ? 'سجل العمليات المصرفية الفورية مع كود التتبع 3DS و RIP' : 'Live real-time ledger with 3DS authorization & reference numbers'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute right-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder={lang === 'ar' ? 'بحث في العمليات...' : 'Search transactions...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 sm:w-60 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 pr-8 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex items-center rounded-lg bg-slate-900 p-0.5 border border-slate-800 text-xs">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  selectedFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.viewAll}
              </button>
              <button
                onClick={() => setSelectedFilter('shopping')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  selectedFilter === 'shopping' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lang === 'ar' ? 'مشتريات' : 'Shopping'}
              </button>
              <button
                onClick={() => setSelectedFilter('transfer')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  selectedFilter === 'transfer' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lang === 'ar' ? 'تحويلات' : 'Transfers'}
              </button>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40">
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right text-xs">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-semibold">{lang === 'ar' ? 'العملية / المستفيد' : 'Transaction / Merchant'}</th>
                  <th className="py-3 px-4 font-semibold">{lang === 'ar' ? 'طريقة الدفع' : 'Payment Method'}</th>
                  <th className="py-3 px-4 font-semibold">{t.date}</th>
                  <th className="py-3 px-4 font-semibold">{t.status}</th>
                  <th className="py-3 px-4 font-semibold text-right rtl:text-left">{lang === 'ar' ? 'المبلغ' : 'Amount'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      {lang === 'ar' ? 'لا توجد عمليات مطابقة لبحثك' : 'No transactions found matching your criteria'}
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-200">
                          {lang === 'ar' ? tx.titleAr : tx.title}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span>{tx.merchant}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono text-slate-400">{tx.reference}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        <span className="font-medium">
                          {tx.method === 'card'
                            ? (lang === 'ar' ? 'بطاقة فيزا 3DS' : 'Visa 3DS')
                            : tx.method === 'baridimob'
                            ? (lang === 'ar' ? 'بريدي موب (RIP)' : 'BaridiMob')
                            : tx.method === 'cib'
                            ? (lang === 'ar' ? 'شبكة CIB' : 'CIB Interbank')
                            : tx.method === 'iban'
                            ? (lang === 'ar' ? 'تحويل دولي IBAN' : 'SEPA/IBAN')
                            : (lang === 'ar' ? 'تحويل نظام داخلي' : 'Internal')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                        {tx.date}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                          <Check className="h-3 w-3" />
                          <span>{t.completed}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right rtl:text-left font-mono font-bold tabular-nums">
                        <span className={tx.type === 'credit' ? 'text-emerald-400' : 'text-slate-100'}>
                          {tx.type === 'credit' ? '+' : '-'} {formatCurrency(tx.amount, tx.currency, lang)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};
