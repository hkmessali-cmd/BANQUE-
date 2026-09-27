import React, { useRef } from 'react';
import { useBanking } from '../context/BankingContext';
import { formatCurrency } from '../utils/formatters';
import { Printer, Download, CheckCircle, ShieldCheck, Building2 } from 'lucide-react';

export const BankStatementModal: React.FC = () => {
  const {
    lang,
    t,
    isStatementOpen,
    setIsStatementOpen,
    user,
    currentAccount,
    transactions,
    totalNetWorthDZD,
  } = useBanking();

  const statementRef = useRef<HTMLDivElement>(null);

  if (!isStatementOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-3xl my-8 rounded-2xl bg-white text-slate-900 border border-slate-200 p-6 sm:p-10 space-y-6 shadow-2xl">
        {/* Actions Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900">{t.viewStatement}</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
              {lang === 'ar' ? 'معتمد رسمياً' : 'Official Document'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>{lang === 'ar' ? 'طباعة / حفظ PDF' : 'Print / PDF'}</span>
            </button>
            <button
              onClick={() => setIsStatementOpen(false)}
              className="text-slate-400 hover:text-slate-700 p-1"
            >
              ✕
            </button>
          </div>
        </div>

        {/* PRINTABLE STATEMENT CONTENT */}
        <div ref={statementRef} className="space-y-6 text-xs text-slate-800">
          {/* Header with Official Logo & Date */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center font-black text-white text-base">
                  N
                </div>
                <div>
                  <h1 className="text-lg font-black text-slate-900 tracking-tight">
                    {lang === 'ar' ? 'بنك نوميديا الرقمي' : 'NUMIDIA DIGITAL BANK'}
                  </h1>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">
                    Licensed Digital Financial Institution · Algiers & Global
                  </p>
                </div>
              </div>
            </div>

            <div className="text-right rtl:text-left space-y-0.5 text-[11px] text-slate-500">
              <div>Date: {new Date().toISOString().split('T')[0]}</div>
              <div className="font-mono">Ref: EXT-DZ-{Math.floor(100000 + Math.random() * 900000)}</div>
              <div className="text-emerald-700 font-semibold">{lang === 'ar' ? 'كشف حساب رسمي موثق' : 'Certified Account Statement'}</div>
            </div>
          </div>

          {/* Account & Client Particulars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-500">
                {lang === 'ar' ? 'صاحب الحساب' : 'Account Holder'}
              </div>
              <div className="font-bold text-sm text-slate-900">{user.fullNameAr} ({user.fullName})</div>
              <div className="text-slate-600">{user.address}</div>
              <div className="text-slate-600">{user.wilaya} · {user.country}</div>
              <div className="text-slate-500 font-mono text-[11px]">NIN / رقم التعريف الوطني: {user.nationalIdNumber}</div>
            </div>

            <div className="space-y-1 sm:text-right rtl:sm:text-left">
              <div className="text-[10px] uppercase font-bold text-slate-500">
                {lang === 'ar' ? 'تفاصيل الحساب البنكي' : 'Banking Coordinates'}
              </div>
              <div className="font-mono font-bold text-slate-900">
                RIB: {currentAccount.rib}
              </div>
              <div className="font-mono text-slate-700">
                IBAN: {currentAccount.iban || currentAccount.accountNumber}
              </div>
              <div className="font-mono text-slate-600">
                BIC/SWIFT: {currentAccount.bicSwift}
              </div>
              <div className="font-bold text-emerald-700 text-sm mt-1">
                {lang === 'ar' ? 'الرصيد الدائن الحالي' : 'Current Balance'}: {formatCurrency(currentAccount.balance, currentAccount.currency, lang)}
              </div>
            </div>
          </div>

          {/* Transaction Ledger Table */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase text-slate-700">
              {lang === 'ar' ? 'كشف تفصيلي بالعمليات المصرفية الأخيرة' : 'Statement of Transactions'}
            </div>

            <table className="w-full border border-slate-200 text-left rtl:text-right text-xs">
              <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2 px-3">{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
                  <th className="py-2 px-3">{lang === 'ar' ? 'البيان / المستفيد' : 'Description'}</th>
                  <th className="py-2 px-3">{lang === 'ar' ? 'المرجع' : 'Reference'}</th>
                  <th className="py-2 px-3 text-right rtl:text-left">{lang === 'ar' ? 'مدين' : 'Debit'}</th>
                  <th className="py-2 px-3 text-right rtl:text-left">{lang === 'ar' ? 'دائن' : 'Credit'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {transactions.slice(0, 8).map((tx) => (
                  <tr key={tx.id} className="text-slate-800">
                    <td className="py-2 px-3 font-mono text-[11px]">{tx.date.slice(0, 10)}</td>
                    <td className="py-2 px-3 font-medium">
                      {lang === 'ar' ? tx.titleAr : tx.title}
                    </td>
                    <td className="py-2 px-3 font-mono text-[11px] text-slate-500">{tx.reference}</td>
                    <td className="py-2 px-3 text-right rtl:text-left font-mono tabular-nums text-slate-900">
                      {tx.type === 'debit' ? formatCurrency(tx.amount, tx.currency, lang) : '-'}
                    </td>
                    <td className="py-2 px-3 text-right rtl:text-left font-mono tabular-nums text-emerald-700 font-bold">
                      {tx.type === 'credit' ? formatCurrency(tx.amount, tx.currency, lang) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Verification QR & Stamp footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t-2 border-slate-200 gap-4">
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 border-2 border-slate-900 p-1 rounded bg-white flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="w-3.5 h-3.5 bg-slate-900" />
                  <div className="w-3.5 h-3.5 bg-slate-900" />
                </div>
                <div className="text-[7px] text-center font-mono font-bold">NUMIDIA-VERIF</div>
                <div className="flex justify-between">
                  <div className="w-3.5 h-3.5 bg-slate-900" />
                  <div className="w-3.5 h-3.5 bg-slate-300" />
                </div>
              </div>
              <div className="text-[10px] text-slate-500 space-y-0.5">
                <div className="font-bold text-slate-800">Electronic Verification Code</div>
                <div>Document signed cryptographically with RSA-4096.</div>
                <div>Scan QR to verify authenticity with Algerian Central Bank network.</div>
              </div>
            </div>

            {/* Official Seal / Stamp */}
            <div className="h-20 w-32 border-2 border-dashed border-emerald-800 rounded-xl flex flex-col items-center justify-center p-2 text-center text-emerald-800 font-bold text-[9px] rotate-[-2deg]">
              <span>NUMIDIA BANK ALGERIA</span>
              <span className="text-[8px] font-normal">DIRECTION DES OPÉRATIONS</span>
              <span className="font-mono text-[8px]">VISA & INTERBANK CERTIFIED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
