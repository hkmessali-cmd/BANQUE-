/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BankingProvider, useBanking } from './context/BankingContext';
import { Header } from './components/Header';
import { AccountOverview } from './components/AccountOverview';
import { VisaCardsHub } from './components/VisaCardsHub';
import { SavingsHub } from './components/SavingsHub';
import { InvestmentsHub } from './components/InvestmentsHub';
import { TransfersHub } from './components/TransfersHub';
import { CurrencyExchangeModal } from './components/CurrencyExchangeModal';
import { BankStatementModal } from './components/BankStatementModal';
import { SecurityCenterModal } from './components/SecurityCenterModal';
import { Simulated3DSModal } from './components/Simulated3DSModal';
import { NotificationsToast } from './components/NotificationsToast';
import { ShieldCheck, Award, Globe, Building2 } from 'lucide-react';

const BankingAppContent: React.FC = () => {
  const { lang, t, activeTab, setActiveTab } = useBanking();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500 selection:text-white">
      {/* Top Bar Contract Navigation */}
      <Header />

      {/* Main Viewport Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'overview' && <AccountOverview />}
        {activeTab === 'cards' && <VisaCardsHub />}
        {activeTab === 'savings' && <SavingsHub />}
        {activeTab === 'investments' && <InvestmentsHub />}
        {activeTab === 'transfers' && <TransfersHub />}
      </main>

      {/* Global Modals & Notifications */}
      <CurrencyExchangeModal />
      <BankStatementModal />
      <SecurityCenterModal />
      <Simulated3DSModal />
      <NotificationsToast />

      {/* Professional Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 mt-12">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs">
              N
            </div>
            <span className="font-bold text-slate-300">
              {lang === 'ar' ? 'بنك نوميديا الرقمي المحدود' : 'Numidia Digital Bank Ltd.'}
            </span>
            <span aria-hidden="true">·</span>
            <span>{lang === 'ar' ? 'الجزائر والعالم' : 'Algeria & Worldwide'}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>{lang === 'ar' ? 'معتمد ومحمي' : 'Regulated & Insured'}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Award className="h-3.5 w-3.5 text-amber-400" />
              <span>{lang === 'ar' ? 'مطابق للشريعة الإسلامية' : 'Sharia Certified'}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Globe className="h-3.5 w-3.5 text-blue-400" />
              <span>{lang === 'ar' ? 'شبكة فيزا العالمية 3DS' : 'Visa International 3DS'}</span>
            </span>
          </div>

          <div className="text-[11px] text-slate-500">
            © 2026 Numidia Bank. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <BankingProvider>
      <BankingAppContent />
    </BankingProvider>
  );
}
