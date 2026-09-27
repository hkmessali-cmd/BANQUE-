export type Currency = 'DZD' | 'EUR' | 'USD';

export type Language = 'ar' | 'en' | 'fr';

export interface BankAccount {
  id: string;
  type: 'checking' | 'savings' | 'investment';
  currency: Currency;
  name: string;
  nameAr: string;
  balance: number;
  accountNumber: string;
  rib: string; // Algerian 20-digit RIB / RIP
  iban?: string; // European IBAN (DZ... or EU...)
  bicSwift: string;
}

export interface VisaCard {
  id: string;
  type: 'virtual' | 'physical' | 'metal';
  tier: 'platinum' | 'infinite' | 'gold';
  name: string;
  nameAr: string;
  cardNumber: string;
  cardholderName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  currency: Currency;
  status: 'active' | 'frozen' | 'cancelled';
  dailyLimit: number;
  monthlyLimit: number;
  currentMonthSpent: number;
  isOnlineEnabled: boolean;
  isContactlessEnabled: boolean;
  isInternationalEnabled: boolean;
  pin: string;
  shippingAddress?: {
    country: string;
    wilaya?: string;
    commune?: string;
    street: string;
    postalCode?: string;
    deliveryType: 'standard' | 'express_dhl';
    trackingNumber?: string;
  };
  createdAt: string;
  colorScheme: 'obsidian' | 'emerald' | 'gold' | 'sapphire';
}

export interface Transaction {
  id: string;
  title: string;
  titleAr: string;
  merchant?: string;
  category: 'shopping' | 'transfer' | 'investment' | 'exchange' | 'bill' | 'savings' | 'salary';
  amount: number;
  currency: Currency;
  type: 'debit' | 'credit';
  date: string;
  status: 'completed' | 'pending' | 'failed';
  method: 'card' | 'baridimob' | 'cib' | 'iban' | 'p2p' | 'exchange' | 'system';
  reference: string;
  fee?: number;
  notes?: string;
}

export interface SavingsVault {
  id: string;
  name: string;
  nameAr: string;
  category: 'car' | 'hajj' | 'emergency' | 'house' | 'general' | 'tech';
  targetAmount: number;
  currentAmount: number;
  currency: Currency;
  deadlineDate?: string;
  isLocked: boolean;
  profitRateAnnual: number; // e.g. 4.8% Sharia-compliant profit share
  accruedProfit: number;
  autoRoundUp: boolean;
  color: string;
}

export interface InvestmentAsset {
  id: string;
  name: string;
  nameAr: string;
  symbol: string;
  type: 'gold' | 'sukuk' | 'equities' | 'projects';
  currentPrice: number;
  currency: Currency;
  change24h: number;
  change1y: number;
  riskLevel: 'low' | 'moderate' | 'medium';
  shariaCompliant: boolean;
  description: string;
  descriptionAr: string;
  userHoldings: number; // quantity (e.g. grams of gold, or shares)
  historicalData: { date: string; price: number }[];
}

export interface UserProfile {
  id: string;
  fullName: string;
  fullNameAr: string;
  email: string;
  phone: string;
  address: string;
  wilaya: string;
  country: string;
  nationalIdNumber: string;
  avatarUrl: string;
  kycStatus: 'verified' | 'pending' | 'review';
  twoFactorEnabled: boolean;
  biometricEnabled: boolean;
  notificationsEnabled: boolean;
}

export interface ExchangeRate {
  pair: string;
  rate: number;
  marketRate?: number; // Algerian parallel market reference
  change24h: number;
}
