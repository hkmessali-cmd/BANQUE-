import { Currency, Language } from '../types/banking';

export function formatCurrency(amount: number, currency: Currency, lang: Language = 'ar'): string {
  const isArabic = lang === 'ar';
  
  if (currency === 'DZD') {
    const formattedNum = new Intl.NumberFormat(isArabic ? 'ar-DZ' : 'fr-DZ', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
    return isArabic ? `${formattedNum} د.ج` : `${formattedNum} DZD`;
  }
  
  if (currency === 'EUR') {
    const formattedNum = new Intl.NumberFormat(isArabic ? 'ar-DZ' : 'en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
    return isArabic ? `${formattedNum} €` : `€${formattedNum}`;
  }
  
  const formattedNum = new Intl.NumberFormat(isArabic ? 'ar-DZ' : 'en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return isArabic ? `${formattedNum} $` : `$${formattedNum}`;
}

export function maskCardNumber(cardNumber: string, reveal: boolean = false): string {
  if (reveal) return cardNumber;
  const parts = cardNumber.split(' ');
  if (parts.length === 4) {
    return `${parts[0]} •••• •••• ${parts[3]}`;
  }
  return '•••• •••• •••• ' + cardNumber.slice(-4);
}

export function generateRandomCardNumber(prefix: string = '4532'): string {
  const randomBlock = () => Math.floor(1000 + Math.random() * 9000).toString();
  return `${prefix} ${randomBlock()} ${randomBlock()} ${randomBlock()}`;
}

export function generateRandomCVV(): string {
  return Math.floor(100 + Math.random() * 900).toString();
}

export function generateReference(prefix: string = 'NUM'): string {
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${rand}`;
}
