import React, { useState, useEffect } from 'react';
import { useBanking } from '../context/BankingContext';
import { Currency } from '../types/banking';
import { formatCurrency } from '../utils/formatters';
import { ArrowLeftRight, TrendingUp, Info, RefreshCw } from 'lucide-react';

export const CurrencyExchangeModal: React.FC = () => {
  const {
    lang,
    t,
    isExchangeOpen,
    setIsExchangeOpen,
    accounts,
    executeCurrencyExchange,
  } = useBanking();

  const [fromCurrency, setFromCurrency] = useState<Currency>('EUR');
  const [toCurrency, setToCurrency] = useState<Currency>('DZD');
  const [fromAmount, setFromAmount] = useState<number>(100);
  const [toAmount, setToAmount] = useState<number>(0);

  // Conversion rates
  // EUR -> DZD: 146.50
  // USD -> DZD: 134.20
  // EUR -> USD: 1.092
  const getRate = (from: Currency, to: Currency): number => {
    if (from === to) return 1;
    if (from === 'EUR' && to === 'DZD') return 146.5;
    if (from === 'DZD' && to === 'EUR') return 1 / 146.5;
    if (from === 'USD' && to === 'DZD') return 134.2;
    if (from === 'DZD' && to === 'USD') return 1 / 134.2;
    if (from === 'EUR' && to === 'USD') return 1.092;
    if (from === 'USD' && to === 'EUR') return 1 / 1.092;
    return 1;
  };

  useEffect(() => {
    const rate = getRate(fromCurrency, toCurrency);
    const calculated = fromAmount * rate;
    setToAmount(Number(calculated.toFixed(2)));
  }, [fromCurrency, toCurrency, fromAmount]);

  if (!isExchangeOpen) return null;

  const currentRate = getRate(fromCurrency, toCurrency);
  const fromAcc = accounts.find((a) => a.currency === fromCurrency);
  const toAcc = accounts.find((a) => a.currency === toCurrency);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleExchangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fromAmount <= 0) return;
    executeCurrencyExchange(fromCurrency, toCurrency, fromAmount, toAmount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-emerald-400" />
              <span>{t.exchangeTitle}</span>
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">{t.exchangeDesc}</p>
          </div>
          <button
            onClick={() => setIsExchangeOpen(false)}
            className="text-slate-400 hover:text-white p-1 text-sm"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleExchangeSubmit} className="space-y-4">
          {/* From Input */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>{t.fromAmount}</span>
              {fromAcc && (
                <span>
                  {lang === 'ar' ? 'الرصيد المتاح' : 'Available'}: {formatCurrency(fromAcc.balance, fromAcc.currency, lang)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                required
                value={fromAmount}
                onChange={(e) => setFromAmount(Number(e.target.value))}
                className="w-full bg-transparent text-xl font-bold text-white font-mono focus:outline-none"
              />
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value as Currency)}
                className="bg-slate-800 border border-slate-700 text-xs font-bold text-white rounded-lg px-2.5 py-1.5 focus:outline-none"
              >
                <option value="EUR">EUR (€)</option>
                <option value="DZD">DZD (د.ج)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center -my-2">
            <button
              type="button"
              onClick={handleSwap}
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-400 shadow-md transition-all"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </button>
          </div>

          {/* To Input */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>{t.toAmount}</span>
              {toAcc && (
                <span>
                  {lang === 'ar' ? 'الرصيد بعد الصرف' : 'New balance'}: {formatCurrency(toAcc.balance + toAmount, toAcc.currency, lang)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                readOnly
                value={toAmount}
                className="w-full bg-transparent text-xl font-bold text-emerald-400 font-mono focus:outline-none"
              />
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value as Currency)}
                className="bg-slate-800 border border-slate-700 text-xs font-bold text-white rounded-lg px-2.5 py-1.5 focus:outline-none"
              >
                <option value="DZD">DZD (د.ج)</option>
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
          </div>

          {/* Exchange Rate summary badge */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">{t.exchangeRateDisplay}:</span>
              <span className="font-mono font-bold text-white">
                1 {fromCurrency} = {currentRate.toFixed(4)} {toCurrency}
              </span>
            </div>
            {(fromCurrency === 'EUR' || toCurrency === 'EUR') && (
              <div className="flex items-center justify-between text-[11px] text-amber-400">
                <span>{t.marketRefRate}:</span>
                <span className="font-mono font-semibold">1 EUR ≈ 243.50 DZD</span>
              </div>
            )}
            <div className="text-[10px] text-emerald-400 flex items-center gap-1 pt-1">
              <Info className="h-3 w-3" />
              <span>{lang === 'ar' ? 'تنفيذ فوري بدون رسوم خفية' : 'Zero hidden commission on inter-account exchange'}</span>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsExchangeOpen(false)}
              className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={!fromAcc || fromAcc.balance < fromAmount}
              className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold rounded-xl text-xs shadow-md"
            >
              {t.confirmExchange}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
