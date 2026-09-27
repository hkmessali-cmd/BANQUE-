import React, { useState } from 'react';
import { useBanking } from '../context/BankingContext';
import { InvestmentAsset, Currency } from '../types/banking';
import { formatCurrency } from '../utils/formatters';
import {
  TrendingUp,
  Coins,
  ShieldCheck,
  Award,
  Layers,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle,
  BarChart3,
  Calendar,
} from 'lucide-react';

export const InvestmentsHub: React.FC = () => {
  const {
    lang,
    t,
    investments,
    accounts,
    buyInvestmentAsset,
    sellInvestmentAsset,
  } = useBanking();

  const [selectedAsset, setSelectedAsset] = useState<InvestmentAsset>(investments[0]);
  const [modalType, setModalType] = useState<'buy' | 'sell' | null>(null);
  const [tradeQuantity, setTradeQuantity] = useState<number>(1);
  const [activeTimeline, setActiveTimeline] = useState<'1M' | '6M' | '1Y' | 'ALL'>('1Y');

  // Profit projection calculator state
  const [calcAmount, setCalcAmount] = useState<number>(100000);
  const [calcYears, setCalcYears] = useState<number>(3);

  const totalPortfolioValueDZD = investments.reduce((acc, inv) => {
    const val = inv.userHoldings * inv.currentPrice;
    if (inv.currency === 'DZD') return acc + val;
    if (inv.currency === 'EUR') return acc + val * 146.5;
    return acc;
  }, 0);

  const handleOpenTrade = (asset: InvestmentAsset, type: 'buy' | 'sell') => {
    setSelectedAsset(asset);
    setModalType(type);
    setTradeQuantity(asset.type === 'gold' ? 2 : 1);
  };

  const handleTradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset || tradeQuantity <= 0) return;

    if (modalType === 'buy') {
      const ok = buyInvestmentAsset(selectedAsset.id, tradeQuantity, selectedAsset.currency);
      if (ok) setModalType(null);
    } else {
      const ok = sellInvestmentAsset(selectedAsset.id, tradeQuantity, selectedAsset.currency);
      if (ok) setModalType(null);
    }
  };

  const expectedProfit = Math.round(
    calcAmount * Math.pow(1 + (selectedAsset.change1y / 100), calcYears) - calcAmount
  );

  return (
    <div className="space-y-8">
      {/* Title & Certification */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">{t.investmentsTitle}</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">{t.investmentsSubtitle}</p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-xs font-semibold">
          <Award className="h-4 w-4" />
          <span>{t.shariaCertified}</span>
        </div>
      </div>

      {/* Main Highlights / Physical Gold Showcase */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-slate-900/60 backdrop-blur-sm p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Sparkles className="h-4 w-4" />
              <span>{lang === 'ar' ? 'الأصل الأكثر طلباً في الجزائر' : 'Top Physical Asset'}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white">
              {investments[0].nameAr}
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed">
              {investments[0].descriptionAr}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-[11px] text-slate-400">{t.pricePerGram}</div>
                <div className="text-base font-bold text-white tabular-nums">
                  {formatCurrency(investments[0].currentPrice, 'DZD', lang)}
                </div>
                <div className="text-[10px] text-emerald-400 font-semibold font-mono">
                  +{investments[0].change24h}% (24h)
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-[11px] text-slate-400">{lang === 'ar' ? 'رصيدك من الذهب' : 'Your Holdings'}</div>
                <div className="text-base font-bold text-amber-400 tabular-nums">
                  {investments[0].userHoldings} {lang === 'ar' ? 'غرام' : 'grams'}
                </div>
                <div className="text-[10px] text-slate-400">
                  ≈ {formatCurrency(investments[0].userHoldings * investments[0].currentPrice, 'DZD', lang)}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 col-span-2 sm:col-span-1">
                <div className="text-[11px] text-slate-400">{lang === 'ar' ? 'العائد السنوي' : '1Y Return'}</div>
                <div className="text-base font-bold text-emerald-400 tabular-nums">
                  +{investments[0].change1y}%
                </div>
                <div className="text-[10px] text-slate-400">
                  {lang === 'ar' ? 'حماية من التضخم' : 'Inflation hedge'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => handleOpenTrade(investments[0], 'buy')}
                className="flex-1 sm:flex-none px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all"
              >
                {t.buyGold}
              </button>
              <button
                onClick={() => handleOpenTrade(investments[0], 'sell')}
                disabled={investments[0].userHoldings <= 0}
                className="flex-1 sm:flex-none px-5 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 font-semibold text-xs border border-slate-700 rounded-xl transition-all"
              >
                {t.sellGold}
              </button>
            </div>
          </div>

          {/* Generated Gold Asset Image */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border border-amber-500/20 shadow-2xl">
              <img
                src="/src/assets/images/gold_ingot_asset_1790545986170.jpg"
                alt="Gold Bullion Vault"
                referrerPolicy="no-referrer"
                className="w-full h-56 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex items-end p-4">
                <div className="text-xs text-slate-200 flex items-center justify-between w-full">
                  <span className="font-semibold">{lang === 'ar' ? 'ذهب خالص عيار 999.9' : 'Pure 999.9 Gold'}</span>
                  <span className="text-[11px] text-amber-400 font-mono">LBMA Certified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Other Investment Assets Catalog */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white tracking-tight">
          {lang === 'ar' ? 'سلة الصناديق والمؤشرات الاستثمارية المتاحة' : 'Investment Portfolios & Sukuk'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {investments.slice(1).map((asset) => (
            <div
              key={asset.id}
              className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                      {asset.symbol}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-0.5">
                      {lang === 'ar' ? asset.nameAr : asset.name}
                    </h4>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                    +{asset.change1y}% / سنة
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {lang === 'ar' ? asset.descriptionAr : asset.description}
                </p>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">{lang === 'ar' ? 'سعر الوحدة' : 'Price per unit'}:</span>
                    <span className="font-mono font-bold text-white tabular-nums">
                      {formatCurrency(asset.currentPrice, asset.currency, lang)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">{t.holdings}:</span>
                    <span className="font-mono font-semibold text-emerald-400 tabular-nums">
                      {asset.userHoldings} {lang === 'ar' ? 'وحدة' : 'units'} ({formatCurrency(asset.userHoldings * asset.currentPrice, asset.currency, lang)})
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => handleOpenTrade(asset, 'buy')}
                  className="py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  {lang === 'ar' ? 'استثمار / شراء' : 'Invest'}
                </button>
                <button
                  onClick={() => handleOpenTrade(asset, 'sell')}
                  disabled={asset.userHoldings <= 0}
                  className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
                >
                  {lang === 'ar' ? 'بيع / تسييل' : 'Liquidate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sharia Profit Simulator */}
      <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-emerald-400" />
              <span>{lang === 'ar' ? 'حاسبة العوائد التقديرية المتوافقة مع الشريعة' : 'Sharia Yield Projection Calculator'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'ar' ? 'احسب نمو استثمارك بالاعتماد على الأداء التاريخي للأصل' : 'Simulate compound return based on historical performance'}
            </p>
          </div>
          <div className="text-xs text-slate-400">
            {lang === 'ar' ? 'الأصل المختار' : 'Target Asset'}: <span className="font-semibold text-white">{lang === 'ar' ? selectedAsset.nameAr : selectedAsset.name}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div className="space-y-1">
            <label className="text-xs text-slate-400">{lang === 'ar' ? 'مبلغ الاستثمار المبدئي' : 'Initial Investment'}</label>
            <input
              type="number"
              min={1000}
              step={10000}
              value={calcAmount}
              onChange={(e) => setCalcAmount(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400">{lang === 'ar' ? 'فترة الاستثمار' : 'Time Horizon'}</label>
            <div className="flex gap-2">
              {[1, 3, 5].map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => setCalcYears(y)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-colors ${
                    calcYears === y ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {y} {lang === 'ar' ? 'سنوات' : 'years'}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
            <div className="text-[11px] text-slate-400">{lang === 'ar' ? 'الربح التقديري التراكمي' : 'Projected Profit'}</div>
            <div className="text-lg font-bold text-emerald-400 tabular-nums">
              +{formatCurrency(expectedProfit, selectedAsset.currency, lang)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {lang === 'ar' ? 'إجمالي المحفظة المتوقع' : 'Total Portfolio'}: {formatCurrency(calcAmount + expectedProfit, selectedAsset.currency, lang)}
            </div>
          </div>
        </div>
      </div>

      {/* Trade Modal (Buy / Sell) */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">
              {modalType === 'buy' ? (lang === 'ar' ? 'تنفيذ أمر شراء استثماري' : 'Buy Order') : (lang === 'ar' ? 'تنفيذ أمر بيع وتسييل' : 'Sell Order')}
            </h3>
            <p className="text-xs text-slate-400">
              {lang === 'ar' ? selectedAsset.nameAr : selectedAsset.name}
            </p>

            <form onSubmit={handleTradeSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-300">
                  {selectedAsset.type === 'gold' ? (lang === 'ar' ? 'عدد الغرامات (عيار 24)' : 'Grams (24K)') : (lang === 'ar' ? 'عدد الوحدات' : 'Units')}
                </label>
                <input
                  type="number"
                  min={1}
                  step={selectedAsset.type === 'gold' ? 0.5 : 1}
                  required
                  value={tradeQuantity}
                  onChange={(e) => setTradeQuantity(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>{lang === 'ar' ? 'سعر الوحدة الحالي' : 'Unit Price'}:</span>
                  <span className="font-mono text-slate-200">{formatCurrency(selectedAsset.currentPrice, selectedAsset.currency, lang)}</span>
                </div>
                <div className="flex justify-between font-bold text-white pt-1 border-t border-slate-800">
                  <span>{lang === 'ar' ? 'المبلغ الإجمالي' : 'Total Amount'}:</span>
                  <span className="font-mono text-emerald-400">{formatCurrency(tradeQuantity * selectedAsset.currentPrice, selectedAsset.currency, lang)}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
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
