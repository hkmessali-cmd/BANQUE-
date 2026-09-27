import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  BankAccount,
  VisaCard,
  Transaction,
  SavingsVault,
  InvestmentAsset,
  UserProfile,
  Currency,
  Language,
  ExchangeRate,
} from '../types/banking';
import {
  INITIAL_USER,
  INITIAL_ACCOUNTS,
  INITIAL_CARDS,
  INITIAL_VAULTS,
  INITIAL_INVESTMENTS,
  INITIAL_TRANSACTIONS,
  EXCHANGE_RATES,
} from '../data/mockData';
import { translations } from '../locales/translations';
import { generateRandomCardNumber, generateRandomCVV, generateReference } from '../utils/formatters';

interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
}

interface Simulated3DS {
  isOpen: boolean;
  merchant: string;
  amount: number;
  currency: Currency;
  otpCode: string;
  cardLast4: string;
  onSuccess: () => void;
  onDecline: () => void;
}

interface BankingContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: typeof translations.ar;
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
  accounts: BankAccount[];
  selectedAccountId: string;
  setSelectedAccountId: (id: string) => void;
  currentAccount: BankAccount;
  cards: VisaCard[];
  vaults: SavingsVault[];
  investments: InvestmentAsset[];
  transactions: Transaction[];
  exchangeRates: ExchangeRate[];
  toasts: ToastNotification[];
  dismissToast: (id: string) => void;
  addToast: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  
  // Modals & Navigation
  activeTab: 'overview' | 'cards' | 'savings' | 'investments' | 'transfers';
  setActiveTab: (tab: 'overview' | 'cards' | 'savings' | 'investments' | 'transfers') => void;
  isExchangeOpen: boolean;
  setIsExchangeOpen: (open: boolean) => void;
  isStatementOpen: boolean;
  setIsStatementOpen: (open: boolean) => void;
  isSecurityOpen: boolean;
  setIsSecurityOpen: (open: boolean) => void;
  isIssueCardOpen: boolean;
  setIsIssueCardOpen: (open: boolean) => void;
  
  // Card Actions
  toggleFreezeCard: (cardId: string) => void;
  toggleCardOnline: (cardId: string) => void;
  toggleCardContactless: (cardId: string) => void;
  toggleCardInternational: (cardId: string) => void;
  updateCardLimits: (cardId: string, daily: number, monthly: number) => void;
  changeCardPin: (cardId: string, newPin: string) => void;
  issueNewVisaCard: (cardData: {
    type: 'virtual' | 'physical' | 'metal';
    tier: 'platinum' | 'infinite' | 'gold';
    name: string;
    currency: Currency;
    shippingWilaya?: string;
    commune?: string;
    street?: string;
    deliveryType?: 'standard' | 'express_dhl';
  }) => void;
  
  // 3DS Simulation
  simulated3DS: Simulated3DS | null;
  trigger3DSTest: (cardId: string) => void;
  close3DS: () => void;

  // Vault Actions
  createVault: (vaultData: Omit<SavingsVault, 'id' | 'currentAmount' | 'accruedProfit'>) => void;
  depositToVault: (vaultId: string, amount: number) => boolean;
  withdrawFromVault: (vaultId: string, amount: number) => boolean;
  toggleAutoRoundUp: (vaultId: string) => void;

  // Investment Actions
  buyInvestmentAsset: (assetId: string, quantityOrAmount: number, sourceCurrency: Currency) => boolean;
  sellInvestmentAsset: (assetId: string, unitsToSell: number, targetCurrency: Currency) => boolean;

  // Transfers & Exchange
  executeTransfer: (params: {
    sourceCurrency: Currency;
    amount: number;
    recipientName: string;
    destinationDetail: string; // RIP, RIB, IBAN, Phone
    type: 'baridimob' | 'cib' | 'iban' | 'p2p' | 'bill';
    notes?: string;
  }) => boolean;
  executeCurrencyExchange: (fromCurrency: Currency, toCurrency: Currency, fromAmount: number, toAmount: number) => boolean;

  // Calculated Stats
  totalNetWorthDZD: number;
}

const BankingContext = createContext<BankingContextType | undefined>(undefined);

export const BankingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('numidia_lang');
    return (saved as Language) || 'ar';
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'cards' | 'savings' | 'investments' | 'transfers'>('overview');
  const [isExchangeOpen, setIsExchangeOpen] = useState(false);
  const [isStatementOpen, setIsStatementOpen] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const [isIssueCardOpen, setIsIssueCardOpen] = useState(false);

  // Core Data loaded from localStorage or mock
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('numidia_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [accounts, setAccounts] = useState<BankAccount[]>(() => {
    const saved = localStorage.getItem('numidia_accounts');
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
  });

  const [selectedAccountId, setSelectedAccountId] = useState<string>('acc_dzd_main');

  const [cards, setCards] = useState<VisaCard[]>(() => {
    const saved = localStorage.getItem('numidia_cards');
    return saved ? JSON.parse(saved) : INITIAL_CARDS;
  });

  const [vaults, setVaults] = useState<SavingsVault[]>(() => {
    const saved = localStorage.getItem('numidia_vaults');
    return saved ? JSON.parse(saved) : INITIAL_VAULTS;
  });

  const [investments, setInvestments] = useState<InvestmentAsset[]>(() => {
    const saved = localStorage.getItem('numidia_investments');
    return saved ? JSON.parse(saved) : INITIAL_INVESTMENTS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('numidia_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [simulated3DS, setSimulated3DS] = useState<Simulated3DS | null>(null);

  // Sync lang direction
  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('numidia_lang', newLang);
  };

  useEffect(() => {
    const isRtl = lang === 'ar';
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('numidia_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('numidia_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('numidia_cards', JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    localStorage.setItem('numidia_vaults', JSON.stringify(vaults));
  }, [vaults]);

  useEffect(() => {
    localStorage.setItem('numidia_investments', JSON.stringify(investments));
  }, [investments]);

  useEffect(() => {
    localStorage.setItem('numidia_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addToast = (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const newToast: ToastNotification = {
      id: 'toast_' + Date.now() + Math.random(),
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString(lang === 'ar' ? 'ar-DZ' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
    };
    setToasts((prev) => [newToast, ...prev].slice(0, 4));

    // Auto dismiss after 5s
    setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== newToast.id));
    }, 5000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const currentAccount = accounts.find((a) => a.id === selectedAccountId) || accounts[0];

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
    addToast(
      lang === 'ar' ? 'تحديث الملف الشخصي' : 'Profile Updated',
      lang === 'ar' ? 'تم حفظ التغييرات بنجاح' : 'Changes saved successfully',
      'success'
    );
  };

  // Card Controls
  const toggleFreezeCard = (cardId: string) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id === cardId) {
          const newStatus = c.status === 'frozen' ? 'active' : 'frozen';
          const isNowFrozen = newStatus === 'frozen';
          addToast(
            isNowFrozen
              ? (lang === 'ar' ? 'تم تجميد البطاقة' : 'Card Frozen')
              : (lang === 'ar' ? 'تم إلغاء تجميد البطاقة' : 'Card Unfrozen'),
            isNowFrozen
              ? (lang === 'ar' ? `البطاقة ${c.cardNumber.slice(-4)} مجمدة ولن تقبل أي عمليات` : `Card ${c.cardNumber.slice(-4)} is now frozen`)
              : (lang === 'ar' ? `البطاقة ${c.cardNumber.slice(-4)} نشطة وجاهزة للاستخدام` : `Card ${c.cardNumber.slice(-4)} is active`),
            isNowFrozen ? 'warning' : 'success'
          );
          return { ...c, status: newStatus };
        }
        return c;
      })
    );
  };

  const toggleCardOnline = (cardId: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, isOnlineEnabled: !c.isOnlineEnabled } : c))
    );
    addToast(
      lang === 'ar' ? 'إعدادات الشراء عبر الإنترنت' : 'Online Purchases Setting',
      lang === 'ar' ? 'تم تحديث أمان عمليات التجارة الإلكترونية' : 'E-commerce security updated',
      'info'
    );
  };

  const toggleCardContactless = (cardId: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, isContactlessEnabled: !c.isContactlessEnabled } : c))
    );
  };

  const toggleCardInternational = (cardId: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, isInternationalEnabled: !c.isInternationalEnabled } : c))
    );
  };

  const updateCardLimits = (cardId: string, daily: number, monthly: number) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, dailyLimit: daily, monthlyLimit: monthly } : c))
    );
    addToast(
      lang === 'ar' ? 'تحديث حدود الإنفاق' : 'Spending Limits Updated',
      lang === 'ar' ? `تم تحديد الحد اليومي: ${daily} والشهري: ${monthly}` : `New limits: Daily ${daily}, Monthly ${monthly}`,
      'success'
    );
  };

  const changeCardPin = (cardId: string, newPin: string) => {
    setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, pin: newPin } : c)));
    addToast(
      lang === 'ar' ? 'تم تغيير الرقم السري PIN' : 'PIN Changed Successfully',
      lang === 'ar' ? 'الرمز السري الجديد ساري الآن في جميع أجهزة الصراف والدفع' : 'New PIN active immediately',
      'success'
    );
  };

  // Issue New Visa Card
  const issueNewVisaCard = (cardData: {
    type: 'virtual' | 'physical' | 'metal';
    tier: 'platinum' | 'infinite' | 'gold';
    name: string;
    currency: Currency;
    shippingWilaya?: string;
    commune?: string;
    street?: string;
    deliveryType?: 'standard' | 'express_dhl';
  }) => {
    const isVirtual = cardData.type === 'virtual';
    const newCard: VisaCard = {
      id: 'crd_' + Date.now(),
      type: cardData.type,
      tier: cardData.tier,
      name: cardData.name || (isVirtual ? 'Visa Platinum Virtual' : 'Visa Infinite Card'),
      nameAr: isVirtual ? 'بطاقة فيزا بلاتينيوم الافتراضية' : 'بطاقة فيزا إنفينيت الدولية',
      cardNumber: generateRandomCardNumber(cardData.tier === 'infinite' ? '4916' : '4532'),
      cardholderName: (user.fullName || 'HAKIM MESSALI').toUpperCase(),
      expiryMonth: '09',
      expiryYear: '30',
      cvv: generateRandomCVV(),
      currency: cardData.currency,
      status: 'active',
      dailyLimit: isVirtual ? 1500 : 5000,
      monthlyLimit: isVirtual ? 5000 : 20000,
      currentMonthSpent: 0,
      isOnlineEnabled: true,
      isContactlessEnabled: true,
      isInternationalEnabled: true,
      pin: '1234',
      shippingAddress: cardData.shippingWilaya
        ? {
            country: 'Algeria',
            wilaya: cardData.shippingWilaya,
            commune: cardData.commune || 'Centre Ville',
            street: cardData.street || 'Rue Principale',
            deliveryType: cardData.deliveryType || 'standard',
            trackingNumber: 'DHL-DZ-' + Math.floor(1000000 + Math.random() * 9000000),
          }
        : undefined,
      createdAt: new Date().toISOString().split('T')[0],
      colorScheme: cardData.tier === 'infinite' ? 'obsidian' : cardData.tier === 'gold' ? 'gold' : 'emerald',
    };

    setCards((prev) => [newCard, ...prev]);
    setIsIssueCardOpen(false);

    addToast(
      lang === 'ar' ? 'تم إصدار بطاقة فيزا كارد بنجاح!' : 'Visa Card Issued Successfully!',
      isVirtual
        ? (lang === 'ar' ? 'البطاقة الافتراضية مفعلة الآن وجاهزة للتسوق عبر الإنترنت فوراً' : 'Virtual card is active and ready for online purchases')
        : (lang === 'ar' ? `تم إرسال طلب البطاقة للشحن إلى ${cardData.shippingWilaya || 'عنوانك'}` : `Card dispatched for delivery to ${cardData.shippingWilaya || 'your address'}`),
      'success'
    );
  };

  // 3DS Simulation
  const trigger3DSTest = (cardId: string) => {
    const card = cards.find((c) => c.id === cardId);
    if (!card) return;

    if (card.status === 'frozen') {
      addToast(
        lang === 'ar' ? 'فشل العملية' : 'Transaction Failed',
        lang === 'ar' ? 'لا يمكن تنفيذ المعاملة لأن البطاقة مجمدة' : 'Card is frozen',
        'error'
      );
      return;
    }

    const testMerchants = [
      { name: 'AliExpress International', amount: 28.5 },
      { name: 'Amazon Prime Video EU', amount: 9.99 },
      { name: 'Google Play Services', amount: 14.99 },
      { name: 'Netflix Premium 4K', amount: 17.99 },
    ];
    const picked = testMerchants[Math.floor(Math.random() * testMerchants.length)];
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    setSimulated3DS({
      isOpen: true,
      merchant: picked.name,
      amount: picked.amount,
      currency: card.currency,
      otpCode: generatedOtp,
      cardLast4: card.cardNumber.slice(-4),
      onSuccess: () => {
        // Debit linked account
        const sourceAcc = accounts.find((a) => a.currency === card.currency) || accounts[0];
        if (sourceAcc.balance < picked.amount) {
          addToast(
            lang === 'ar' ? 'رصيد غير كافٍ' : 'Insufficient Funds',
            lang === 'ar' ? `رصيد حسابك في ${card.currency} لا يكفي لإتمام العملية` : 'Insufficient balance',
            'error'
          );
          setSimulated3DS(null);
          return;
        }

        setAccounts((prev) =>
          prev.map((a) => (a.id === sourceAcc.id ? { ...a, balance: a.balance - picked.amount } : a))
        );

        const newTx: Transaction = {
          id: 'tx_' + Date.now(),
          title: `Online Purchase - ${picked.name}`,
          titleAr: `شراء إلكتروني عبر فيزا - ${picked.name}`,
          merchant: picked.name,
          category: 'shopping',
          amount: picked.amount,
          currency: card.currency,
          type: 'debit',
          date: new Date().toISOString().replace('T', ' ').slice(0, 16),
          status: 'completed',
          method: 'card',
          reference: generateReference('3DS'),
          notes: `Verified by Visa 3DS (Card •••• ${card.cardNumber.slice(-4)})`,
        };

        setTransactions((prev) => [newTx, ...prev]);
        setSimulated3DS(null);

        addToast(
          lang === 'ar' ? 'تم تأكيد المعاملة 3DS بنجاح' : '3DS Payment Approved',
          lang === 'ar' ? `تم خصم ${picked.amount} ${card.currency} لصالح ${picked.name}` : `Charged ${picked.amount} ${card.currency} at ${picked.name}`,
          'success'
        );
      },
      onDecline: () => {
        setSimulated3DS(null);
        addToast(
          lang === 'ar' ? 'تم رفض المعاملة' : 'Transaction Declined',
          lang === 'ar' ? 'تم إلغاء عملية الدفع بأمان' : 'Payment was declined by user',
          'info'
        );
      },
    });
  };

  const close3DS = () => setSimulated3DS(null);

  // Vault Actions
  const createVault = (vaultData: Omit<SavingsVault, 'id' | 'currentAmount' | 'accruedProfit'>) => {
    const newVault: SavingsVault = {
      ...vaultData,
      id: 'vlt_' + Date.now(),
      currentAmount: 0,
      accruedProfit: 0,
    };
    setVaults((prev) => [newVault, ...prev]);
    addToast(
      lang === 'ar' ? 'تم إنشاء الخزنة بنجاح' : 'Vault Created',
      lang === 'ar' ? `خزنة "${vaultData.nameAr || vaultData.name}" جاهزة لاستقبال مدخراتك` : `Vault "${vaultData.name}" is ready`,
      'success'
    );
  };

  const depositToVault = (vaultId: string, amount: number): boolean => {
    const vault = vaults.find((v) => v.id === vaultId);
    if (!vault || amount <= 0) return false;

    const sourceAcc = accounts.find((a) => a.currency === vault.currency) || accounts[0];
    if (sourceAcc.balance < amount) {
      addToast(
        lang === 'ar' ? 'رصيد غير كافٍ' : 'Insufficient Balance',
        lang === 'ar' ? `رصيدك في حساب ${vault.currency} هو ${sourceAcc.balance}` : `Available: ${sourceAcc.balance} ${vault.currency}`,
        'error'
      );
      return false;
    }

    setAccounts((prev) =>
      prev.map((a) => (a.id === sourceAcc.id ? { ...a, balance: a.balance - amount } : a))
    );

    setVaults((prev) =>
      prev.map((v) => (v.id === vaultId ? { ...v, currentAmount: v.currentAmount + amount } : v))
    );

    const newTx: Transaction = {
      id: 'tx_' + Date.now(),
      title: `Deposit to Vault (${vault.name})`,
      titleAr: `إيداع في خزنة (${vault.nameAr})`,
      merchant: 'Numidia Vaults',
      category: 'savings',
      amount,
      currency: vault.currency,
      type: 'debit',
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'completed',
      method: 'system',
      reference: generateReference('VLT'),
    };
    setTransactions((prev) => [newTx, ...prev]);

    addToast(
      lang === 'ar' ? 'تم الإيداع في الخزنة' : 'Deposited to Vault',
      lang === 'ar' ? `تم تحويل ${amount} ${vault.currency} إلى ${vault.nameAr}` : `Transferred ${amount} ${vault.currency} to ${vault.name}`,
      'success'
    );
    return true;
  };

  const withdrawFromVault = (vaultId: string, amount: number): boolean => {
    const vault = vaults.find((v) => v.id === vaultId);
    if (!vault || amount <= 0) return false;

    if (vault.currentAmount < amount) {
      addToast(
        lang === 'ar' ? 'المبلغ المطلوب غير متاح في الخزنة' : 'Insufficient Vault Balance',
        lang === 'ar' ? `الرصيد المتاح داخل الخزنة: ${vault.currentAmount} ${vault.currency}` : `Available in vault: ${vault.currentAmount}`,
        'error'
      );
      return false;
    }

    const targetAcc = accounts.find((a) => a.currency === vault.currency) || accounts[0];

    setVaults((prev) =>
      prev.map((v) => (v.id === vaultId ? { ...v, currentAmount: v.currentAmount - amount } : v))
    );

    setAccounts((prev) =>
      prev.map((a) => (a.id === targetAcc.id ? { ...a, balance: a.balance + amount } : a))
    );

    const newTx: Transaction = {
      id: 'tx_' + Date.now(),
      title: `Withdrawal from Vault (${vault.name})`,
      titleAr: `سحب من خزنة (${vault.nameAr})`,
      merchant: 'Numidia Vaults',
      category: 'savings',
      amount,
      currency: vault.currency,
      type: 'credit',
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'completed',
      method: 'system',
      reference: generateReference('VLT-WTH'),
    };
    setTransactions((prev) => [newTx, ...prev]);

    addToast(
      lang === 'ar' ? 'تم السحب من الخزنة' : 'Withdrawn from Vault',
      lang === 'ar' ? `تم استرجاع ${amount} ${vault.currency} إلى حسابك الجاري` : `Returned ${amount} ${vault.currency} to checking account`,
      'success'
    );
    return true;
  };

  const toggleAutoRoundUp = (vaultId: string) => {
    setVaults((prev) =>
      prev.map((v) => (v.id === vaultId ? { ...v, autoRoundUp: !v.autoRoundUp } : v))
    );
    addToast(
      lang === 'ar' ? 'ميزة ادخار الفكة الآلي' : 'Spare Change Round-Up',
      lang === 'ar' ? 'تم تحديث إعدادات تقريب المعاملات والادخار التلقائي' : 'Spare change settings updated',
      'info'
    );
  };

  // Investment Buy & Sell
  const buyInvestmentAsset = (assetId: string, quantityOrAmount: number, sourceCurrency: Currency): boolean => {
    const asset = investments.find((a) => a.id === assetId);
    if (!asset || quantityOrAmount <= 0) return false;

    // Cost calculation in asset currency
    const totalCost = asset.type === 'gold' ? quantityOrAmount * asset.currentPrice : quantityOrAmount * asset.currentPrice;
    const sourceAcc = accounts.find((a) => a.currency === asset.currency) || accounts[0];

    if (sourceAcc.balance < totalCost) {
      addToast(
        lang === 'ar' ? 'رصيد غير كافٍ للاستثمار' : 'Insufficient Investment Balance',
        lang === 'ar' ? `التكلفة الإجمالية: ${totalCost} ${asset.currency}، الرصيد المتاح: ${sourceAcc.balance} ${sourceAcc.currency}` : `Required: ${totalCost} ${asset.currency}`,
        'error'
      );
      return false;
    }

    setAccounts((prev) =>
      prev.map((a) => (a.id === sourceAcc.id ? { ...a, balance: a.balance - totalCost } : a))
    );

    setInvestments((prev) =>
      prev.map((inv) =>
        inv.id === assetId ? { ...inv, userHoldings: inv.userHoldings + quantityOrAmount } : inv
      )
    );

    const newTx: Transaction = {
      id: 'tx_' + Date.now(),
      title: `Investment Purchase - ${asset.name}`,
      titleAr: `استثمار - ${asset.nameAr} (${quantityOrAmount} ${asset.type === 'gold' ? 'غرام' : 'حصة'})`,
      merchant: 'Numidia Wealth & Bullion',
      category: 'investment',
      amount: totalCost,
      currency: asset.currency,
      type: 'debit',
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'completed',
      method: 'system',
      reference: generateReference('INV-BUY'),
    };
    setTransactions((prev) => [newTx, ...prev]);

    addToast(
      lang === 'ar' ? 'تم تنفيذ أمر الشراء بنجاح' : 'Order Executed Successfully',
      lang === 'ar' ? `تمت إضافة ${quantityOrAmount} ${asset.type === 'gold' ? 'غرام ذهب خالص' : 'وحدة استثمارية'} إلى محفظتك` : `Added ${quantityOrAmount} units to portfolio`,
      'success'
    );
    return true;
  };

  const sellInvestmentAsset = (assetId: string, unitsToSell: number, targetCurrency: Currency): boolean => {
    const asset = investments.find((a) => a.id === assetId);
    if (!asset || unitsToSell <= 0) return false;

    if (asset.userHoldings < unitsToSell) {
      addToast(
        lang === 'ar' ? 'كمية غير كافية للبيع' : 'Insufficient Holdings',
        lang === 'ar' ? `رصيدك الحالي هو ${asset.userHoldings}` : `Current holdings: ${asset.userHoldings}`,
        'error'
      );
      return false;
    }

    const proceeds = unitsToSell * asset.currentPrice;
    const targetAcc = accounts.find((a) => a.currency === asset.currency) || accounts[0];

    setInvestments((prev) =>
      prev.map((inv) =>
        inv.id === assetId ? { ...inv, userHoldings: inv.userHoldings - unitsToSell } : inv
      )
    );

    setAccounts((prev) =>
      prev.map((a) => (a.id === targetAcc.id ? { ...a, balance: a.balance + proceeds } : a))
    );

    const newTx: Transaction = {
      id: 'tx_' + Date.now(),
      title: `Investment Liquidation - ${asset.name}`,
      titleAr: `تسييل استثماري - بيع ${unitsToSell} من ${asset.nameAr}`,
      merchant: 'Numidia Wealth',
      category: 'investment',
      amount: proceeds,
      currency: asset.currency,
      type: 'credit',
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'completed',
      method: 'system',
      reference: generateReference('INV-SELL'),
    };
    setTransactions((prev) => [newTx, ...prev]);

    addToast(
      lang === 'ar' ? 'تم تسييل وبيع الأصول' : 'Asset Sold Successfully',
      lang === 'ar' ? `تم إيداع العائد بقيمة ${proceeds} ${asset.currency} في حسابك` : `Credited ${proceeds} ${asset.currency} to account`,
      'success'
    );
    return true;
  };

  // Transfers execution
  const executeTransfer = (params: {
    sourceCurrency: Currency;
    amount: number;
    recipientName: string;
    destinationDetail: string;
    type: 'baridimob' | 'cib' | 'iban' | 'p2p' | 'bill';
    notes?: string;
  }): boolean => {
    const sourceAcc = accounts.find((a) => a.currency === params.sourceCurrency) || accounts[0];

    if (sourceAcc.balance < params.amount) {
      addToast(
        lang === 'ar' ? 'رصيد غير كافٍ لإتمام التحويل' : 'Insufficient Balance',
        lang === 'ar' ? `الرصيد المتاح هو ${sourceAcc.balance} ${params.sourceCurrency}` : `Available: ${sourceAcc.balance} ${params.sourceCurrency}`,
        'error'
      );
      return false;
    }

    setAccounts((prev) =>
      prev.map((a) => (a.id === sourceAcc.id ? { ...a, balance: a.balance - params.amount } : a))
    );

    const ref = generateReference(params.type.toUpperCase());
    const newTx: Transaction = {
      id: 'tx_' + Date.now(),
      title: `Transfer to ${params.recipientName}`,
      titleAr: `تحويل إلى ${params.recipientName} (${params.type === 'baridimob' ? 'بريدي موب' : params.type === 'cib' ? 'بنوك جزائرية' : params.type === 'iban' ? 'دولي SEPA' : 'فوري'})`,
      merchant: params.recipientName,
      category: params.type === 'bill' ? 'bill' : 'transfer',
      amount: params.amount,
      currency: params.sourceCurrency,
      type: 'debit',
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'completed',
      method: params.type === 'baridimob' ? 'baridimob' : params.type === 'cib' ? 'cib' : params.type === 'iban' ? 'iban' : 'p2p',
      reference: ref,
      notes: params.destinationDetail,
    };

    setTransactions((prev) => [newTx, ...prev]);

    addToast(
      lang === 'ar' ? 'تم تنفيذ التحويل الفوري بنجاح' : 'Transfer Sent Successfully',
      lang === 'ar' ? `المبلغ ${params.amount} ${params.sourceCurrency} إلى ${params.recipientName} - إشعار: ${ref}` : `Sent ${params.amount} ${params.sourceCurrency} to ${params.recipientName} (Ref: ${ref})`,
      'success'
    );
    return true;
  };

  // Currency Exchange execution
  const executeCurrencyExchange = (
    fromCurrency: Currency,
    toCurrency: Currency,
    fromAmount: number,
    toAmount: number
  ): boolean => {
    const fromAcc = accounts.find((a) => a.currency === fromCurrency);
    const toAcc = accounts.find((a) => a.currency === toCurrency);

    if (!fromAcc || !toAcc) return false;

    if (fromAcc.balance < fromAmount) {
      addToast(
        lang === 'ar' ? 'رصيد غير كافٍ للصرف' : 'Insufficient Exchange Balance',
        lang === 'ar' ? `رصيدك في حساب ${fromCurrency} لا يغطي المبلغ المطلوب` : `Insufficient ${fromCurrency} balance`,
        'error'
      );
      return false;
    }

    setAccounts((prev) =>
      prev.map((a) => {
        if (a.id === fromAcc.id) return { ...a, balance: a.balance - fromAmount };
        if (a.id === toAcc.id) return { ...a, balance: a.balance + toAmount };
        return a;
      })
    );

    const ref = generateReference('FX');
    const newTx: Transaction = {
      id: 'tx_' + Date.now(),
      title: `Exchange ${fromCurrency} ➔ ${toCurrency}`,
      titleAr: `صرف عملات: تحويل ${fromAmount} ${fromCurrency} إلى ${toAmount} ${toCurrency}`,
      merchant: 'Numidia FX Engine',
      category: 'exchange',
      amount: fromAmount,
      currency: fromCurrency,
      type: 'debit',
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'completed',
      method: 'exchange',
      reference: ref,
    };
    setTransactions((prev) => [newTx, ...prev]);

    addToast(
      lang === 'ar' ? 'تم صرف وتحويل العملة بنجاح' : 'Currency Exchanged Successfully',
      lang === 'ar' ? `تم استلام ${toAmount} ${toCurrency} في حسابك` : `Received ${toAmount} ${toCurrency}`,
      'success'
    );
    setIsExchangeOpen(false);
    return true;
  };

  // Calculate Total Net Worth normalized in DZD for high-level overview
  const totalNetWorthDZD = accounts.reduce((acc, a) => {
    if (a.currency === 'DZD') return acc + a.balance;
    if (a.currency === 'EUR') return acc + a.balance * 146.5;
    if (a.currency === 'USD') return acc + a.balance * 134.2;
    return acc;
  }, 0) + vaults.reduce((acc, v) => {
    if (v.currency === 'DZD') return acc + v.currentAmount;
    if (v.currency === 'EUR') return acc + v.currentAmount * 146.5;
    return acc;
  }, 0) + investments.reduce((acc, inv) => {
    const val = inv.userHoldings * inv.currentPrice;
    if (inv.currency === 'DZD') return acc + val;
    if (inv.currency === 'EUR') return acc + val * 146.5;
    return acc;
  }, 0);

  const t = translations[lang];

  return (
    <BankingContext.Provider
      value={{
        lang,
        setLang,
        t,
        user,
        updateUser,
        accounts,
        selectedAccountId,
        setSelectedAccountId,
        currentAccount,
        cards,
        vaults,
        investments,
        transactions,
        exchangeRates: EXCHANGE_RATES,
        toasts,
        dismissToast,
        addToast,
        activeTab,
        setActiveTab,
        isExchangeOpen,
        setIsExchangeOpen,
        isStatementOpen,
        setIsStatementOpen,
        isSecurityOpen,
        setIsSecurityOpen,
        isIssueCardOpen,
        setIsIssueCardOpen,
        toggleFreezeCard,
        toggleCardOnline,
        toggleCardContactless,
        toggleCardInternational,
        updateCardLimits,
        changeCardPin,
        issueNewVisaCard,
        simulated3DS,
        trigger3DSTest,
        close3DS,
        createVault,
        depositToVault,
        withdrawFromVault,
        toggleAutoRoundUp,
        buyInvestmentAsset,
        sellInvestmentAsset,
        executeTransfer,
        executeCurrencyExchange,
        totalNetWorthDZD,
      }}
    >
      {children}
    </BankingContext.Provider>
  );
};

export const useBanking = () => {
  const context = useContext(BankingContext);
  if (!context) {
    throw new Error('useBanking must be used within a BankingProvider');
  }
  return context;
};
