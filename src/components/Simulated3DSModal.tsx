import React, { useState } from 'react';
import { useBanking } from '../context/BankingContext';
import { formatCurrency } from '../utils/formatters';
import { ShieldCheck, Lock, Smartphone, Check, X } from 'lucide-react';

export const Simulated3DSModal: React.FC = () => {
  const { lang, simulated3DS, close3DS } = useBanking();
  const [enteredOtp, setEnteredOtp] = useState('');

  if (!simulated3DS || !simulated3DS.isOpen) return null;

  const handleAutoFill = () => {
    setEnteredOtp(simulated3DS.otpCode);
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOtp === simulated3DS.otpCode) {
      simulated3DS.onSuccess();
    } else {
      alert(lang === 'ar' ? 'رمز الأمان OTP غير صحيح' : 'Invalid OTP code');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs">
      <div className="w-full max-w-sm rounded-2xl bg-white text-slate-900 border border-slate-200 p-6 space-y-5 shadow-2xl">
        {/* Visa 3D Secure Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-black italic tracking-tighter text-blue-800">
              VISA
            </span>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Secure
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
            <ShieldCheck className="h-4 w-4" />
            <span>NUMIDIA BANK</span>
          </div>
        </div>

        {/* Transaction Summary */}
        <div className="space-y-2 text-xs">
          <div className="text-center py-2 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-slate-500 text-[11px]">
              {lang === 'ar' ? 'معاملة شراء عبر الإنترنت' : 'Online E-Commerce Payment'}
            </div>
            <div className="text-lg font-bold text-slate-900">
              {simulated3DS.merchant}
            </div>
            <div className="text-xl font-black text-emerald-700 mt-1 tabular-nums font-mono">
              {formatCurrency(simulated3DS.amount, simulated3DS.currency, lang)}
            </div>
          </div>

          <div className="flex justify-between text-slate-600 text-[11px] pt-1 px-1">
            <span>{lang === 'ar' ? 'البطاقة المستخدمة' : 'Card ending'}:</span>
            <span className="font-mono font-bold text-slate-900">•••• {simulated3DS.cardLast4}</span>
          </div>
        </div>

        {/* OTP Input Form */}
        <form onSubmit={handleConfirm} className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-700 font-medium">
                {lang === 'ar' ? 'رمز الأمان لمرة واحدة (OTP)' : 'One-Time Passcode (OTP)'}
              </span>
              <button
                type="button"
                onClick={handleAutoFill}
                className="text-[11px] text-blue-700 hover:text-blue-800 font-bold"
              >
                {lang === 'ar' ? 'نسخ الرمز تلقائياً' : 'Auto-fill'}
              </button>
            </div>

            <div className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-center text-xs text-blue-900 font-mono font-bold tracking-widest">
              {lang === 'ar' ? `رمز التحقق المرسل لهاتفك: ${simulated3DS.otpCode}` : `SMS Code: ${simulated3DS.otpCode}`}
            </div>

            <input
              type="text"
              maxLength={6}
              required
              autoFocus
              placeholder="123456"
              value={enteredOtp}
              onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
              className="w-full text-center tracking-widest text-xl font-mono py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={simulated3DS.onDecline}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
            >
              {lang === 'ar' ? 'إلغاء المعاملة' : 'Decline'}
            </button>
            <button
              type="submit"
              disabled={enteredOtp.length !== 6}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-700/20"
            >
              {lang === 'ar' ? 'تأكيد الدفع' : 'Authorize'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
