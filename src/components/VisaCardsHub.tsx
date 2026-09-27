import React, { useState } from 'react';
import { useBanking } from '../context/BankingContext';
import { VisaCard, Currency } from '../types/banking';
import { maskCardNumber, formatCurrency } from '../utils/formatters';
import { WILAYAS_OF_ALGERIA } from '../data/mockData';
import {
  CreditCard,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  RotateCw,
  Globe,
  Wifi,
  ShoppingBag,
  Sliders,
  KeyRound,
  CheckCircle2,
  Truck,
  Plus,
  Zap,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const VisaCardsHub: React.FC = () => {
  const {
    lang,
    t,
    cards,
    toggleFreezeCard,
    toggleCardOnline,
    toggleCardContactless,
    toggleCardInternational,
    updateCardLimits,
    changeCardPin,
    issueNewVisaCard,
    trigger3DSTest,
    isIssueCardOpen,
    setIsIssueCardOpen,
    user,
  } = useBanking();

  const [selectedCardId, setSelectedCardId] = useState<string>(cards[0]?.id || '');
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [showNumber, setShowNumber] = useState<boolean>(false);
  const [showCvv, setShowCvv] = useState<boolean>(false);

  // Edit limits state
  const activeCard = cards.find((c) => c.id === selectedCardId) || cards[0];
  const [dailyLimit, setDailyLimit] = useState<number>(activeCard ? activeCard.dailyLimit : 1500);
  const [monthlyLimit, setMonthlyLimit] = useState<number>(activeCard ? activeCard.monthlyLimit : 5000);
  const [isPinModalOpen, setIsPinModalOpen] = useState<boolean>(false);
  const [newPin, setNewPin] = useState<string>('');

  // Issuance Wizard State
  const [newCardType, setNewCardType] = useState<'virtual' | 'physical' | 'metal'>('virtual');
  const [newCardTier, setNewCardTier] = useState<'platinum' | 'infinite' | 'gold'>('platinum');
  const [newCardCurrency, setNewCardCurrency] = useState<Currency>('EUR');
  const [cardholderName, setCardholderName] = useState<string>(user.fullName.toUpperCase());
  const [shippingDestination, setShippingDestination] = useState<'algeria' | 'worldwide'>('algeria');
  const [selectedWilaya, setSelectedWilaya] = useState<string>(WILAYAS_OF_ALGERIA[15]); // 16 Alger
  const [commune, setCommune] = useState<string>('الجزائر الوسطى - Alger Centre');
  const [street, setStreet] = useState<string>('شارع ديدوش مراد');
  const [intlCountry, setIntlCountry] = useState<string>('France');
  const [deliveryType, setDeliveryType] = useState<'standard' | 'express_dhl'>('express_dhl');

  const handleSelectCard = (id: string) => {
    setSelectedCardId(id);
    setIsFlipped(false);
    setShowNumber(false);
    setShowCvv(false);
    const card = cards.find((c) => c.id === id);
    if (card) {
      setDailyLimit(card.dailyLimit);
      setMonthlyLimit(card.monthlyLimit);
    }
  };

  const handleSaveLimits = () => {
    if (activeCard) {
      updateCardLimits(activeCard.id, dailyLimit, monthlyLimit);
    }
  };

  const handleChangePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length === 4 && activeCard) {
      changeCardPin(activeCard.id, newPin);
      setIsPinModalOpen(false);
      setNewPin('');
    }
  };

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    issueNewVisaCard({
      type: newCardType,
      tier: newCardTier,
      name:
        newCardType === 'virtual'
          ? 'Visa Platinum Virtual'
          : newCardType === 'metal'
          ? 'Visa Infinite Black Metal'
          : 'Visa Gold Classic',
      currency: newCardCurrency,
      shippingWilaya: shippingDestination === 'algeria' ? selectedWilaya : intlCountry,
      commune,
      street,
      deliveryType,
    });
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">{t.visaCardsTitle}</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">{t.visaCardsSubtitle}</p>
        </div>

        <button
          onClick={() => setIsIssueCardOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition-colors shadow-lg shadow-emerald-950/40"
        >
          <Plus className="h-4 w-4" />
          <span>{t.issueNewCard}</span>
        </button>
      </div>

      {/* Main Grid: Card Viewer on Left/Top, Controls on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Card Showcase & Selector */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card Select Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {cards.map((c) => (
              <button
                key={c.id}
                onClick={() => handleSelectCard(c.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
                  c.id === activeCard.id
                    ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                {c.type === 'virtual' ? '📱 ' : '💳 '}
                {lang === 'ar' ? c.nameAr : c.name}
              </button>
            ))}
          </div>

          {/* 3D Interactive Card */}
          <div className="relative mx-auto w-full max-w-[390px] h-[240px] perspective-1000">
            <div
              className={`relative w-full h-full rounded-2xl p-6 text-white shadow-2xl transition-transform duration-700 preserve-3d border border-white/10 ${
                isFlipped ? 'rotate-y-180' : ''
              } ${
                activeCard.colorScheme === 'gold'
                  ? 'gold-gradient text-slate-950'
                  : activeCard.colorScheme === 'emerald'
                  ? 'emerald-gradient text-white'
                  : 'obsidian-gradient text-white'
              } ${activeCard.status === 'frozen' ? 'filter grayscale-[80%]' : ''}`}
            >
              {/* Frozen Overlay Badge */}
              {activeCard.status === 'frozen' && (
                <div className="absolute inset-0 z-30 flex items-center justify-center rounded-2xl bg-slate-950/70 backdrop-blur-xs">
                  <div className="flex items-center gap-2 rounded-lg bg-rose-500/90 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                    <Lock className="h-4 w-4" />
                    <span>{t.cardFrozenNotice}</span>
                  </div>
                </div>
              )}

              {/* CARD FRONT */}
              <div className={`absolute inset-0 p-6 flex flex-col justify-between backface-hidden rounded-2xl ${isFlipped ? 'hidden' : 'block'}`}>
                {/* Header: Bank Brand & Contactless Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded bg-emerald-500 flex items-center justify-center font-black text-slate-950 text-xs">
                      N
                    </div>
                    <span className="font-extrabold tracking-wider text-xs">
                      {lang === 'ar' ? 'بنك نوميديا' : 'NUMIDIA BANK'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wifi className="h-4 w-4 rotate-90 opacity-80" />
                    <span className="text-[10px] font-mono tracking-widest uppercase opacity-75">
                      {activeCard.tier}
                    </span>
                  </div>
                </div>

                {/* EMV Chip & Hologram */}
                <div className="flex items-center justify-between my-auto">
                  <div className="h-9 w-12 rounded-md bg-gradient-to-tr from-amber-300 via-amber-200 to-yellow-500 border border-amber-600/40 shadow-inner flex items-center justify-center">
                    <div className="w-8 h-6 border border-amber-800/40 rounded-sm grid grid-cols-2 opacity-60" />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-mono tracking-widest opacity-75">
                      {activeCard.type === 'virtual' ? 'VIRTUAL SECURE' : 'PHYSICAL CHIP'}
                    </span>
                  </div>
                </div>

                {/* Card Number & Details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-lg sm:text-xl font-bold tracking-widest tabular-nums">
                      {maskCardNumber(activeCard.cardNumber, showNumber)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowNumber(!showNumber)}
                      className="p-1 opacity-70 hover:opacity-100 transition-opacity"
                      title={showNumber ? 'Hide' : 'Show'}
                    >
                      {showNumber ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  <div className="flex items-end justify-between text-xs">
                    <div>
                      <div className="text-[9px] uppercase tracking-wider opacity-70">
                        Cardholder
                      </div>
                      <div className="font-semibold tracking-wide truncate max-w-[170px]">
                        {activeCard.cardholderName}
                      </div>
                    </div>

                    <div>
                      <div className="text-[9px] uppercase tracking-wider opacity-70">
                        Expires
                      </div>
                      <div className="font-mono font-semibold">
                        {activeCard.expiryMonth}/{activeCard.expiryYear}
                      </div>
                    </div>

                    {/* Visa Logo */}
                    <div className="text-xl font-black italic tracking-tighter text-right">
                      <span className="text-blue-400">VI</span>
                      <span className="text-amber-400">SA</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD BACK */}
              <div className={`absolute inset-0 p-6 flex flex-col justify-between backface-hidden rotate-y-180 rounded-2xl ${isFlipped ? 'block' : 'hidden'}`}>
                {/* Magnetic Strip */}
                <div className="-mx-6 -mt-2 h-10 bg-slate-950/90" />

                {/* CVV Panel */}
                <div className="space-y-1 my-auto">
                  <div className="flex items-center justify-between text-[10px] text-slate-300">
                    <span>Authorized Signature</span>
                    <span>CVV2 / CVC</span>
                  </div>
                  <div className="flex items-center justify-between bg-white text-slate-900 rounded p-1.5 font-mono">
                    <div className="h-3 w-32 bg-slate-200 italic text-[9px] flex items-center px-1">
                      Numidia Client
                    </div>
                    <span className="font-bold text-xs tabular-nums text-slate-950">
                      {showCvv ? activeCard.cvv : '•••'}
                    </span>
                  </div>
                </div>

                {/* Back Footer info */}
                <div className="flex items-end justify-between text-[9px] text-slate-300 opacity-80">
                  <div className="space-y-0.5">
                    <div>Issued by Numidia Digital Bank Ltd.</div>
                    <div>24/7 International Support: +213 21 00 00 00</div>
                  </div>
                  <div className="text-lg font-black italic tracking-tighter">
                    VISA
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Card Action Tools */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
            >
              <RotateCw className="h-3.5 w-3.5" />
              <span>{isFlipped ? (lang === 'ar' ? 'عرض الوجه' : 'Front') : (lang === 'ar' ? 'عرض ظهر البطاقة و CVV' : 'Flip to Back')}</span>
            </button>

            <button
              onClick={() => setShowCvv(!showCvv)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
            >
              {showCvv ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              <span>{showCvv ? t.hideCvv : t.showCvv}</span>
            </button>

            <button
              onClick={() => trigger3DSTest(activeCard.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-300 bg-amber-950/40 hover:bg-amber-950/70 border border-amber-800/60 rounded-lg transition-colors"
              title="Test a real 3D secure payment prompt"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>{t.testOnlinePurchase}</span>
            </button>
          </div>

          {/* Shipping / Delivery Status Card for Physical Cards */}
          {activeCard.shippingAddress && (
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Truck className="h-4 w-4 text-emerald-400" />
                  <span>{t.deliveryStatus}</span>
                </span>
                <span className="text-emerald-400 font-semibold">
                  {lang === 'ar' ? 'تم الشحن والتوصيل' : 'Delivered & Activated'}
                </span>
              </div>
              <div className="text-slate-400">
                {activeCard.shippingAddress.wilaya} · {activeCard.shippingAddress.commune}
              </div>
              {activeCard.shippingAddress.trackingNumber && (
                <div className="text-slate-500 font-mono text-[11px]">
                  DHL Express Tracking: {activeCard.shippingAddress.trackingNumber}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Card Security Controls & Limit Sliders on Right */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card Status & Freeze toggle */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>{lang === 'ar' ? 'مركز التحكم وأمان البطاقة' : 'Card Security & Controls'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {lang === 'ar' ? 'تحكم فوري مباشر في تفعيل وإيقاف وظائف البطاقة' : 'Instant live controls over your card capabilities'}
                </p>
              </div>

              <button
                onClick={() => toggleFreezeCard(activeCard.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  activeCard.status === 'frozen'
                    ? 'bg-rose-500 hover:bg-rose-400 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                {activeCard.status === 'frozen' ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4 text-emerald-400" />}
                <span>{activeCard.status === 'frozen' ? t.unfreezeCard : t.freezeCard}</span>
              </button>
            </div>

            {/* Toggle Features Matrix */}
            <div className="space-y-4">
              {/* Online Purchases */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="h-4 w-4 text-slate-400" />
                  <div>
                    <div className="text-xs font-bold text-slate-200">{t.onlinePurchases}</div>
                    <div className="text-[11px] text-slate-400">AliExpress, Amazon, Google, Meta, Netflix</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeCard.isOnlineEnabled}
                    onChange={() => toggleCardOnline(activeCard.id)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              {/* Contactless NFC */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center gap-3">
                  <Wifi className="h-4 w-4 text-slate-400 rotate-90" />
                  <div>
                    <div className="text-xs font-bold text-slate-200">{t.contactlessNfc}</div>
                    <div className="text-[11px] text-slate-400">Apple Pay, Google Wallet & POS Terminals</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeCard.isContactlessEnabled}
                    onChange={() => toggleCardContactless(activeCard.id)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              {/* International Roaming */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-slate-400" />
                  <div>
                    <div className="text-xs font-bold text-slate-200">{t.internationalRoaming}</div>
                    <div className="text-[11px] text-slate-400">{lang === 'ar' ? 'معاملات بدون رسوم تحويل إضافية في 200+ دولة' : 'Foreign payments in 200+ countries'}</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeCard.isInternationalEnabled}
                    onChange={() => toggleCardInternational(activeCard.id)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            </div>

            {/* Limits Controls */}
            <div className="pt-2 border-t border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sliders className="h-4 w-4 text-emerald-400" />
                  <span>{lang === 'ar' ? 'تعديل حدود الصرف والإنفاق' : 'Spending Limits'}</span>
                </span>
                <button
                  onClick={handleSaveLimits}
                  className="px-3 py-1 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-xs font-semibold rounded-lg transition-colors"
                >
                  {t.save}
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>{t.dailyLimit}</span>
                    <span className="font-mono font-bold">{formatCurrency(dailyLimit, activeCard.currency, lang)}</span>
                  </div>
                  <input
                    type="range"
                    min={100}
                    max={activeCard.currency === 'DZD' ? 500000 : 10000}
                    step={activeCard.currency === 'DZD' ? 10000 : 100}
                    value={dailyLimit}
                    onChange={(e) => setDailyLimit(Number(e.target.value))}
                    className="w-full accent-emerald-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>{t.monthlyLimit}</span>
                    <span className="font-mono font-bold">{formatCurrency(monthlyLimit, activeCard.currency, lang)}</span>
                  </div>
                  <input
                    type="range"
                    min={500}
                    max={activeCard.currency === 'DZD' ? 2000000 : 30000}
                    step={activeCard.currency === 'DZD' ? 50000 : 500}
                    value={monthlyLimit}
                    onChange={(e) => setMonthlyLimit(Number(e.target.value))}
                    className="w-full accent-emerald-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Change PIN Action */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-200">{t.changePin}</div>
                <div className="text-[11px] text-slate-400">{lang === 'ar' ? 'رمز الصراف الآلي المكون من 4 أرقام' : '4-digit ATM & POS security PIN'}</div>
              </div>
              <button
                onClick={() => setIsPinModalOpen(true)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <KeyRound className="h-3.5 w-3.5 text-emerald-400" />
                <span>{t.changePin}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PIN Change Modal */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">{t.changePin}</h3>
            <p className="text-xs text-slate-400">
              {lang === 'ar'
                ? `أدخل الرمز السري الجديد المكون من 4 أرقام للبطاقة المنتهية بـ ${activeCard.cardNumber.slice(-4)}`
                : `Enter new 4-digit PIN for card ending in ${activeCard.cardNumber.slice(-4)}`}
            </p>

            <form onSubmit={handleChangePinSubmit} className="space-y-4">
              <input
                type="password"
                maxLength={4}
                autoFocus
                placeholder="••••"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                className="w-full text-center tracking-widest text-2xl font-mono py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsPinModalOpen(false)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={newPin.length !== 4}
                  className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 rounded-xl text-xs font-bold"
                >
                  {t.confirm}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Issue New Card Wizard Modal */}
      {isIssueCardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-xl my-8 rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white">{t.issuanceModalTitle}</h2>
                <p className="text-xs text-slate-400 mt-0.5">{t.shippingAlgeriaWorldwide}</p>
              </div>
              <button
                onClick={() => setIsIssueCardOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleIssueSubmit} className="space-y-6">
              {/* Select Card Tier / Type */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">{t.selectCardType}</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Virtual */}
                  <div
                    onClick={() => {
                      setNewCardType('virtual');
                      setNewCardTier('platinum');
                    }}
                    className={`cursor-pointer p-4 rounded-xl border text-xs space-y-1.5 transition-all ${
                      newCardType === 'virtual'
                        ? 'bg-slate-800 border-emerald-500 ring-1 ring-emerald-500/50'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">Visa Platinum</span>
                      <span className="text-[10px] text-emerald-400 font-bold">{lang === 'ar' ? 'فوري' : 'Instant'}</span>
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      {lang === 'ar' ? 'افتراضية للتسوق والاشتراكات بدون رسوم إصدار' : 'Virtual for e-commerce, 0$ setup fee'}
                    </div>
                  </div>

                  {/* Infinite Metal */}
                  <div
                    onClick={() => {
                      setNewCardType('metal');
                      setNewCardTier('infinite');
                    }}
                    className={`cursor-pointer p-4 rounded-xl border text-xs space-y-1.5 transition-all ${
                      newCardType === 'metal'
                        ? 'bg-slate-800 border-amber-500 ring-1 ring-amber-500/50'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">Visa Infinite</span>
                      <span className="text-[10px] text-amber-400 font-bold">Metal</span>
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      {lang === 'ar' ? 'معدنية فاخرة مع دخول صالات المطارات وتأمين سفر' : 'Heavy metal, LoungeKey & travel insurance'}
                    </div>
                  </div>

                  {/* Gold Classic */}
                  <div
                    onClick={() => {
                      setNewCardType('physical');
                      setNewCardTier('gold');
                    }}
                    className={`cursor-pointer p-4 rounded-xl border text-xs space-y-1.5 transition-all ${
                      newCardType === 'physical'
                        ? 'bg-slate-800 border-emerald-500 ring-1 ring-emerald-500/50'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">Visa Gold</span>
                      <span className="text-[10px] text-slate-300 font-bold">CIB / Visa</span>
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      {lang === 'ar' ? 'بلاستيكية للاستخدام اليومي والسحب من الصراف' : 'Everyday card with ATM cash withdrawal'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Cardholder Name & Currency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">{t.cardholderNameLabel}</label>
                  <input
                    type="text"
                    required
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value.toUpperCase())}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono uppercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">{t.selectCurrency}</label>
                  <select
                    value={newCardCurrency}
                    onChange={(e) => setNewCardCurrency(e.target.value as Currency)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="EUR">اليورو الأوروبي (EUR €)</option>
                    <option value="USD">الدولار الأمريكي (USD $)</option>
                    <option value="DZD">الدينار الجزائري (DZD د.ج)</option>
                  </select>
                </div>
              </div>

              {/* Delivery Address (for physical & metal cards) */}
              {newCardType !== 'virtual' && (
                <div className="space-y-3 pt-3 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300">{t.shippingAddressAlgeria}</label>
                    <div className="flex items-center rounded-lg bg-slate-950 p-0.5 border border-slate-800 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setShippingDestination('algeria')}
                        className={`px-2.5 py-1 rounded font-medium ${shippingDestination === 'algeria' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400'}`}
                      >
                        {t.algeria} (58 ولاية)
                      </button>
                      <button
                        type="button"
                        onClick={() => setShippingDestination('worldwide')}
                        className={`px-2.5 py-1 rounded font-medium ${shippingDestination === 'worldwide' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400'}`}
                      >
                        {t.worldwide} (DHL Express)
                      </button>
                    </div>
                  </div>

                  {shippingDestination === 'algeria' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] text-slate-400">{t.wilayaSelect}</label>
                        <select
                          value={selectedWilaya}
                          onChange={(e) => setSelectedWilaya(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                        >
                          {WILAYAS_OF_ALGERIA.map((w) => (
                            <option key={w} value={w}>
                              {w}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] text-slate-400">{t.communeInput}</label>
                        <input
                          type="text"
                          required
                          value={commune}
                          onChange={(e) => setCommune(e.target.value)}
                          placeholder="البلدية - الرمز البريدي"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-[11px] text-slate-400">{t.streetAddress}</label>
                        <input
                          type="text"
                          required
                          value={street}
                          onChange={(e) => setStreet(e.target.value)}
                          placeholder="الشارع ورقم العمارة / المنزل"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] text-slate-400">Country / البلد</label>
                        <input
                          type="text"
                          required
                          value={intlCountry}
                          onChange={(e) => setIntlCountry(e.target.value)}
                          placeholder="e.g. France, UAE, Canada, UK"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] text-slate-400">City & Postal Code</label>
                        <input
                          type="text"
                          required
                          value={commune}
                          onChange={(e) => setCommune(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* Delivery partner */}
                  <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="deliveryOption"
                        checked={deliveryType === 'express_dhl'}
                        onChange={() => setDeliveryType('express_dhl')}
                        className="accent-emerald-500"
                      />
                      <span>DHL Express (3-5 {lang === 'ar' ? 'أيام عمل' : 'business days'})</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="deliveryOption"
                        checked={deliveryType === 'standard'}
                        onChange={() => setDeliveryType('standard')}
                        className="accent-emerald-500"
                      />
                      <span>Algérie Poste EMS Colis</span>
                    </label>
                  </div>
                </div>
              )}

              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-[11px] text-emerald-300">
                {t.instantIssuanceNote}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsIssueCardOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-emerald-950/40"
                >
                  {t.confirmAndIssue}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
