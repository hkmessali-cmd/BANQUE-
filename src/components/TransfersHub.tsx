import React, { useState } from 'react';
import { useBanking } from '../context/BankingContext';
import { Currency } from '../types/banking';
import { formatCurrency } from '../utils/formatters';
import {
  Send,
  Building,
  Globe,
  Smartphone,
  QrCode,
  Zap,
  CheckCircle2,
  Receipt,
  Scan,
  Sparkles,
} from 'lucide-react';

export const TransfersHub: React.FC = () => {
  const {
    lang,
    t,
    accounts,
    executeTransfer,
    user,
    addToast,
  } = useBanking();

  const [transferMode, setTransferMode] = useState<'baridimob' | 'cib' | 'international' | 'p2p' | 'bills'>('baridimob');

  // Form states
  const [sourceCurrency, setSourceCurrency] = useState<Currency>('DZD');
  const [recipientName, setRecipientName] = useState('');
  const [destinationDetail, setDestinationDetail] = useState('');
  const [transferAmount, setTransferAmount] = useState<number>(15000);
  const [transferNotes, setTransferNotes] = useState('');

  // Bill payment specifics
  const [selectedBiller, setSelectedBiller] = useState<'mobilis' | 'djezzy' | 'ooredoo' | 'sonelgaz' | 'algerie_telecom'>('mobilis');
  const [billReference, setBillReference] = useState('0550123456');

  // QR Modal Simulation
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrType, setQrType] = useState<'receive' | 'scan'>('receive');

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName && transferMode !== 'bills') return;
    if (transferAmount <= 0) return;

    const actualRecipient =
      transferMode === 'bills'
        ? `${selectedBiller.toUpperCase()} - ${billReference}`
        : recipientName;

    const actualType =
      transferMode === 'baridimob'
        ? 'baridimob'
        : transferMode === 'cib'
        ? 'cib'
        : transferMode === 'international'
        ? 'iban'
        : transferMode === 'bills'
        ? 'bill'
        : 'p2p';

    const ok = executeTransfer({
      sourceCurrency,
      amount: transferAmount,
      recipientName: actualRecipient,
      destinationDetail: transferMode === 'bills' ? billReference : destinationDetail,
      type: actualType,
      notes: transferNotes,
    });

    if (ok) {
      setRecipientName('');
      setDestinationDetail('');
      setTransferNotes('');
    }
  };

  const handleSimulateScan = () => {
    setRecipientName('Amina Benali (أمينة بن علي)');
    setDestinationDetail('+213 550 99 88 77');
    setTransferAmount(5000);
    setShowQrModal(false);
    addToast(
      lang === 'ar' ? 'تم مسح رمز QR بنجاح' : 'QR Code Scanned',
      lang === 'ar' ? 'تم جلب بيانات المستفيد والمبلغ المطلوب' : 'Recipient details loaded',
      'success'
    );
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">{t.transfersTitle}</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">{t.transfersSubtitle}</p>
        </div>

        <button
          onClick={() => {
            setQrType('receive');
            setShowQrModal(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold rounded-xl transition-colors"
        >
          <QrCode className="h-4 w-4 text-emerald-400" />
          <span>{lang === 'ar' ? 'رمز QR للدفع والاستلام' : 'QR Pay & Request'}</span>
        </button>
      </div>

      {/* Transfer Category Segmented Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800">
        <button
          onClick={() => {
            setTransferMode('baridimob');
            setSourceCurrency('DZD');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl whitespace-nowrap transition-colors ${
            transferMode === 'baridimob'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Smartphone className="h-4 w-4" />
          <span>{t.transferBaridimob}</span>
        </button>

        <button
          onClick={() => {
            setTransferMode('cib');
            setSourceCurrency('DZD');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl whitespace-nowrap transition-colors ${
            transferMode === 'cib'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building className="h-4 w-4" />
          <span>{t.transferInterbank}</span>
        </button>

        <button
          onClick={() => {
            setTransferMode('international');
            setSourceCurrency('EUR');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl whitespace-nowrap transition-colors ${
            transferMode === 'international'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Globe className="h-4 w-4" />
          <span>{t.transferInternational}</span>
        </button>

        <button
          onClick={() => {
            setTransferMode('p2p');
            setSourceCurrency('DZD');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl whitespace-nowrap transition-colors ${
            transferMode === 'p2p'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="h-4 w-4" />
          <span>{t.transferP2P}</span>
        </button>

        <button
          onClick={() => {
            setTransferMode('bills');
            setSourceCurrency('DZD');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl whitespace-nowrap transition-colors ${
            transferMode === 'bills'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Receipt className="h-4 w-4" />
          <span>{lang === 'ar' ? 'فواتير وشحن رصيد' : 'Recharge & Bills'}</span>
        </button>
      </div>

      {/* Main Transfer Workspace Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-6">
          <form onSubmit={handleTransferSubmit} className="space-y-5">
            {/* Account Selector & Amount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">{t.sourceAccount}</label>
                <select
                  value={sourceCurrency}
                  onChange={(e) => setSourceCurrency(e.target.value as Currency)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.currency}>
                      {lang === 'ar' ? acc.nameAr : acc.name} ({formatCurrency(acc.balance, acc.currency, lang)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">{t.amountLabel}</label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    required
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">
                    {sourceCurrency}
                  </span>
                </div>
              </div>
            </div>

            {/* Mode-specific Fields */}
            {transferMode === 'baridimob' && (
              <div className="space-y-4 pt-2 border-t border-slate-800">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">{t.recipientName}</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: محمد بن عيسى (Mohamed Ben Aissa)"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    {lang === 'ar' ? 'رقم الحساب البريدي الجاري RIP (20 رقم)' : 'BaridiMob 20-digit RIP'}
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={20}
                    placeholder="00799999002345678912"
                    value={destinationDetail}
                    onChange={(e) => setDestinationDetail(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono tracking-widest focus:outline-none focus:border-emerald-500"
                  />
                  <div className="text-[11px] text-emerald-400">
                    {lang === 'ar' ? 'تحويل فوري خلال ثوانٍ إلى حساب بريد الجزائر' : 'Instant execution 24/7 to Algérie Poste accounts'}
                  </div>
                </div>
              </div>
            )}

            {transferMode === 'cib' && (
              <div className="space-y-4 pt-2 border-t border-slate-800">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">{t.recipientName}</label>
                  <input
                    type="text"
                    required
                    placeholder="الاسم الكامل أو اسم الشركة"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    {lang === 'ar' ? 'رقم الحساب البنكي الجزائري RIB (20 رقم)' : 'Algerian Bank RIB (20 digits)'}
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={20}
                    placeholder="00200000001234567890"
                    value={destinationDetail}
                    onChange={(e) => setDestinationDetail(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono tracking-widest focus:outline-none focus:border-emerald-500"
                  />
                  <div className="text-[11px] text-slate-400">
                    {lang === 'ar' ? 'يدعم جميع البنوك: BNA, BEA, CPA, BDL, BADR, Al Baraka, Gulf Bank...' : 'Supported across all Algerian CIB member banks'}
                  </div>
                </div>
              </div>
            )}

            {transferMode === 'international' && (
              <div className="space-y-4 pt-2 border-t border-slate-800">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    {lang === 'ar' ? 'اسم المستفيد الدولي' : 'Beneficiary Full Name'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe / Tech Corp EU"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    {lang === 'ar' ? 'الآيبان الدولي (IBAN)' : 'International IBAN'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="FR76 3000 4000 0100 2345 6789 012"
                    value={destinationDetail}
                    onChange={(e) => setDestinationDetail(e.target.value.toUpperCase())}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500 uppercase"
                  />
                </div>
              </div>
            )}

            {transferMode === 'p2p' && (
              <div className="space-y-4 pt-2 border-t border-slate-800">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    {lang === 'ar' ? 'رقم هاتف المستفيد أو معرّف نوميديا' : 'Phone Number or Numidia Handle'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="+213 550 12 34 56 أو @messali"
                      value={destinationDetail}
                      onChange={(e) => {
                        setDestinationDetail(e.target.value);
                        if (!recipientName) setRecipientName(e.target.value);
                      }}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setQrType('scan');
                        setShowQrModal(true);
                      }}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Scan className="h-4 w-4 text-emerald-400" />
                      <span>{lang === 'ar' ? 'مسح QR' : 'Scan'}</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">{t.recipientName}</label>
                  <input
                    type="text"
                    required
                    placeholder="اسم الصديق أو الزميل"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            {transferMode === 'bills' && (
              <div className="space-y-4 pt-2 border-t border-slate-800">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">
                    {lang === 'ar' ? 'اختر مزود الخدمة' : 'Select Service Provider'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      { id: 'mobilis', name: 'موبيليس (Mobilis)' },
                      { id: 'djezzy', name: 'جيزي (Djezzy)' },
                      { id: 'ooredoo', name: 'أوريدو (Ooredoo)' },
                      { id: 'sonelgaz', name: 'سونلغاز (Sonelgaz)' },
                      { id: 'algerie_telecom', name: 'اتصالات الجزائر (Idoom)' },
                    ].map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setSelectedBiller(b.id as any)}
                        className={`p-2 rounded-xl border text-xs font-semibold transition-all ${
                          selectedBiller === b.id
                            ? 'bg-slate-800 border-emerald-500 text-emerald-400'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {b.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    {selectedBiller === 'sonelgaz'
                      ? (lang === 'ar' ? 'رقم الفاتورة أو مرجع العداد' : 'Bill Reference')
                      : (lang === 'ar' ? 'رقم الهاتف المراد شحنه' : 'Phone / Line Number')}
                  </label>
                  <input
                    type="text"
                    required
                    value={billReference}
                    onChange={(e) => setBillReference(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            {/* Note / Memo */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">{lang === 'ar' ? 'ملاحظة أو بيان التحويل (اختياري)' : 'Transfer Memo'}</label>
              <input
                type="text"
                placeholder={lang === 'ar' ? 'مثال: أتعاب تصميم، مستحقات...' : 'e.g. Freelance invoice, family help...'}
                value={transferNotes}
                onChange={(e) => setTransferNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-colors"
              >
                <Send className="h-4 w-4" />
                <span>{t.executeTransfer}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Informational Assurance Panel on Right */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3 text-xs">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span>{lang === 'ar' ? 'مزايا شبكة التحويل الفوري' : 'Instant Network Features'}</span>
            </h3>

            <div className="space-y-2 text-slate-400">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{lang === 'ar' ? 'بدون أي عمولات خفية بين حسابات بريدي موب ونوميديا' : 'Zero hidden fees on BaridiMob & Numidia transfers'}</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{lang === 'ar' ? 'إشعار فوري برقم تتبع مصرفي معتمد قانونياً' : 'Official bank reference for legal compliance'}</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{lang === 'ar' ? 'تحويلات SEPA تصل للبنوك الأوروبية في نفس اليوم' : 'SEPA Eurozone transfers delivered same-day'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Pay / Scan Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-5 shadow-2xl text-center">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {qrType === 'receive' ? (lang === 'ar' ? 'رمز QR لاستقبال الأموال' : 'My Payment QR') : (lang === 'ar' ? 'مسح رمز المستفيد' : 'Scan Recipient QR')}
              </h3>
              <button onClick={() => setShowQrModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {qrType === 'receive' ? (
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-2xl inline-block shadow-inner">
                  {/* Stylized QR simulation */}
                  <div className="w-48 h-48 bg-slate-950 p-2 rounded-xl flex flex-col justify-between">
                    <div className="flex justify-between">
                      <div className="w-12 h-12 border-4 border-white bg-slate-950 p-1 flex items-center justify-center">
                        <div className="w-5 h-5 bg-white" />
                      </div>
                      <div className="w-12 h-12 border-4 border-white bg-slate-950 p-1 flex items-center justify-center">
                        <div className="w-5 h-5 bg-white" />
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <span className="font-mono text-emerald-400 font-bold text-[10px]">NUMIDIA-PAY</span>
                    </div>
                    <div className="flex justify-between">
                      <div className="w-12 h-12 border-4 border-white bg-slate-950 p-1 flex items-center justify-center">
                        <div className="w-5 h-5 bg-white" />
                      </div>
                      <div className="w-10 h-10 border border-dashed border-white" />
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-300">
                  <div className="font-bold">{user.fullNameAr} ({user.phone})</div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">RIP: 00799999002345678912</div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative w-48 h-48 mx-auto rounded-2xl border-2 border-dashed border-emerald-500/80 bg-slate-950/80 flex flex-col items-center justify-center p-4">
                  <Scan className="h-12 w-12 text-emerald-400 animate-pulse" />
                  <span className="text-[11px] text-slate-400 mt-2">
                    {lang === 'ar' ? 'ضع الكاميرا أمام رمز QR' : 'Align camera over QR'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleSimulateScan}
                  className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs"
                >
                  {lang === 'ar' ? 'محاكاة قراءة الرمز تلقائياً' : 'Simulate Scan Complete'}
                </button>
              </div>
            )}

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
            >
              {t.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
