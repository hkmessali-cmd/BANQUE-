import React from 'react';
import { useBanking } from '../context/BankingContext';
import { ShieldCheck, RefreshCw, FileText, Globe } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    lang,
    setLang,
    t,
    user,
    activeTab,
    setActiveTab,
    setIsExchangeOpen,
    setIsStatementOpen,
    setIsSecurityOpen,
  } = useBanking();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand title wordmark (single line, no clutter) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 font-bold text-slate-950 shadow-md shadow-emerald-500/20">
              <span className="text-lg font-black tracking-tighter">N</span>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-white sm:text-lg">
                {lang === 'ar' ? 'بنك نوميديا الرقمي' : 'Numidia Bank'}
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (clean text links, no static pill islands) */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'overview'
                ? 'bg-slate-800 text-emerald-400'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
            }`}
          >
            {t.accounts}
          </button>
          <button
            onClick={() => setActiveTab('cards')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'cards'
                ? 'bg-slate-800 text-emerald-400'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
            }`}
          >
            {t.cards}
          </button>
          <button
            onClick={() => setActiveTab('savings')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'savings'
                ? 'bg-slate-800 text-emerald-400'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
            }`}
          >
            {t.savings}
          </button>
          <button
            onClick={() => setActiveTab('investments')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'investments'
                ? 'bg-slate-800 text-emerald-400'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
            }`}
          >
            {t.investments}
          </button>
          <button
            onClick={() => setActiveTab('transfers')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'transfers'
                ? 'bg-slate-800 text-emerald-400'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
            }`}
          >
            {t.transfers}
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Language switcher, Quick Exchange, Security & Statement) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Exchange CTA */}
          <button
            onClick={() => setIsExchangeOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
            title={t.exchangeCurrency}
          >
            <RefreshCw className="h-3.5 w-3.5 text-emerald-400" />
            <span>{t.exchangeCurrency}</span>
          </button>

          {/* Statement CTA */}
          <button
            onClick={() => setIsStatementOpen(true)}
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition-colors whitespace-nowrap"
            title={t.viewStatement}
          >
            <FileText className="h-3.5 w-3.5 text-slate-400" />
            <span>{t.viewStatement}</span>
          </button>

          {/* Language Selector Dropdown */}
          <div className="flex items-center rounded-lg bg-slate-900 p-0.5 border border-slate-800 text-xs">
            <button
              onClick={() => setLang('ar')}
              className={`px-2 py-1 rounded font-medium transition-colors ${
                lang === 'ar' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              عربي
            </button>
            <button
              onClick={() => setLang('fr')}
              className={`px-2 py-1 rounded font-medium transition-colors ${
                lang === 'fr' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              FR
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-1 rounded font-medium transition-colors ${
                lang === 'en' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              EN
            </button>
          </div>

          {/* Security & Profile Button */}
          <button
            onClick={() => setIsSecurityOpen(true)}
            className="flex items-center gap-2 p-1 pl-2 sm:pl-2.5 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
            title={t.security}
          >
            <span className="hidden sm:inline text-xs font-medium text-slate-300">
              {lang === 'ar' ? user.fullNameAr : user.fullName}
            </span>
            <img
              src={user.avatarUrl}
              alt={user.fullName}
              referrerPolicy="no-referrer"
              className="h-7 w-7 rounded-full object-cover ring-1 ring-emerald-500/40"
            />
          </button>
        </div>
      </div>

      {/* Mobile Secondary Navigation Row */}
      <div className="flex md:hidden items-center justify-around border-t border-slate-900 px-2 py-2 overflow-x-auto bg-slate-950">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-2.5 py-1 text-xs font-medium rounded whitespace-nowrap ${
            activeTab === 'overview' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400'
          }`}
        >
          {t.accounts}
        </button>
        <button
          onClick={() => setActiveTab('cards')}
          className={`px-2.5 py-1 text-xs font-medium rounded whitespace-nowrap ${
            activeTab === 'cards' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400'
          }`}
        >
          {t.cards}
        </button>
        <button
          onClick={() => setActiveTab('savings')}
          className={`px-2.5 py-1 text-xs font-medium rounded whitespace-nowrap ${
            activeTab === 'savings' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400'
          }`}
        >
          {t.savings}
        </button>
        <button
          onClick={() => setActiveTab('investments')}
          className={`px-2.5 py-1 text-xs font-medium rounded whitespace-nowrap ${
            activeTab === 'investments' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400'
          }`}
        >
          {t.investments}
        </button>
        <button
          onClick={() => setActiveTab('transfers')}
          className={`px-2.5 py-1 text-xs font-medium rounded whitespace-nowrap ${
            activeTab === 'transfers' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400'
          }`}
        >
          {t.transfers}
        </button>
      </div>
    </header>
  );
};
