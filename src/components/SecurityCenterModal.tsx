import React from 'react';
import { useBanking } from '../context/BankingContext';
import { ShieldCheck, Fingerprint, Smartphone, Lock, CheckCircle2, AlertTriangle, Key } from 'lucide-react';

export const SecurityCenterModal: React.FC = () => {
  const {
    lang,
    t,
    isSecurityOpen,
    setIsSecurityOpen,
    user,
    updateUser,
  } = useBanking();

  if (!isSecurityOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-xl my-8 rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{t.security}</h2>
              <p className="text-xs text-slate-400">
                {lang === 'ar' ? 'حماية الحساب والتشفير البنكي المتقدم' : 'Account security & advanced cryptographic safeguards'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSecurityOpen(false)}
            className="text-slate-400 hover:text-white p-1"
          >
            ✕
          </button>
        </div>

        {/* Security Vault Asset Banner */}
        <div className="relative rounded-xl overflow-hidden border border-slate-800 h-36">
          <img
            src="/src/assets/images/bank_security_vault_1790545997908.jpg"
            alt="Bank Security Vault"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex items-end p-4">
            <div className="text-xs text-white">
              <div className="font-bold flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>{lang === 'ar' ? 'حسابك مؤمن بنسبة 100% مع ضمان الودائع المصرفية' : 'Deposit guarantee & 256-bit encryption active'}</span>
              </div>
              <div className="text-slate-300 text-[11px]">
                {lang === 'ar' ? 'بنية تحتية مشفرة بروتوكول ISO/IEC 27001' : 'ISO/IEC 27001 certified banking infrastructure'}
              </div>
            </div>
          </div>
        </div>

        {/* Security Toggles */}
        <div className="space-y-4">
          {/* Biometric Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-3">
              <Fingerprint className="h-5 w-5 text-emerald-400" />
              <div>
                <div className="text-xs font-bold text-white">
                  {lang === 'ar' ? 'تسجيل الدخول بالبصمة / Face ID' : 'Biometric Login (Face ID / Fingerprint)'}
                </div>
                <div className="text-[11px] text-slate-400">
                  {lang === 'ar' ? 'تأكيد العمليات المصرفية الحساسة بالبصمة البيومترية' : 'Authorize sensitive transfers instantly'}
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={user.biometricEnabled}
                onChange={(e) => updateUser({ biometricEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          {/* 2FA SMS & Authenticator */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-emerald-400" />
              <div>
                <div className="text-xs font-bold text-white">
                  {lang === 'ar' ? 'التحقق بخطوتين (2FA SMS / App)' : 'Two-Factor Authentication (2FA)'}
                </div>
                <div className="text-[11px] text-slate-400">
                  {lang === 'ar' ? `رمز تأكيد يرسل لهاتفك المسجل (${user.phone})` : `OTP sent to verified phone number (${user.phone})`}
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={user.twoFactorEnabled}
                onChange={(e) => updateUser({ twoFactorEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          {/* Active Sessions */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-white">
              {lang === 'ar' ? 'الأجهزة المتصلة بالحساب حالياً' : 'Authorized Active Sessions'}
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span>Google Chrome · Algiers, Algeria (Current)</span>
                </span>
                <span className="text-[11px] text-emerald-400 font-semibold font-mono">Active Now</span>
              </div>
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Numidia Mobile App · iPhone 15 Pro (Alger)</span>
                <span className="font-mono">Yesterday 22:15</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsSecurityOpen(false)}
          className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
        >
          {t.close}
        </button>
      </div>
    </div>
  );
};
