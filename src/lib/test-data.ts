// Iyzico test verileri ve yardımcı fonksiyonlar

export const TEST_CARDS = {
  // Başarılı ödeme kartları
  SUCCESS: {
    HALKBANK_MC: {
      cardNumber: '5528790000000008',
      bank: 'Halkbank',
      type: 'Master Card (Credit)',
      cvv: '123',
      expireMonth: '12',
      expireYear: '2030'
    },
    DENIZBANK_VISA_DEBIT: {
      cardNumber: '4766620000000001',
      bank: 'Denizbank',
      type: 'Visa (Debit)',
      cvv: '123',
      expireMonth: '12',
      expireYear: '2030'
    },
    AKBANK_MC_DEBIT: {
      cardNumber: '5890040000000016',
      bank: 'Akbank',
      type: 'Master Card (Debit)',
      cvv: '123',
      expireMonth: '12',
      expireYear: '2030'
    },
    DENIZBANK_VISA_CREDIT: {
      cardNumber: '4603450000000000',
      bank: 'Denizbank',
      type: 'Visa (Credit)',
      cvv: '123',
      expireMonth: '12',
      expireYear: '2030'
    }
  },
  
  // Hata test kartları
  ERROR: {
    INSUFFICIENT_FUNDS: {
      cardNumber: '4111111111111129',
      error: 'Yetersiz bakiye',
      cvv: '123',
      expireMonth: '12',
      expireYear: '2030'
    },
    DO_NOT_HONOUR: {
      cardNumber: '4129111111111111',
      error: 'İşlem reddedildi',
      cvv: '123',
      expireMonth: '12',
      expireYear: '2030'
    },
    INVALID_TRANSACTION: {
      cardNumber: '4128111111111112',
      error: 'Geçersiz işlem',
      cvv: '123',
      expireMonth: '12',
      expireYear: '2030'
    },
    LOST_CARD: {
      cardNumber: '4127111111111113',
      error: 'Kayıp kart',
      cvv: '123',
      expireMonth: '12',
      expireYear: '2030'
    }
  }
};

export const TEST_BUYER_INFO = {
  DEFAULT: {
    id: 'BY789',
    name: 'John',
    surname: 'Doe',
    gsmNumber: '+905350000000',
    email: 'john@example.com',
    identityNumber: '11111111111',
    lastLoginDate: '2015-10-05 12:43:35',
    registrationDate: '2013-04-21 15:12:09',
    registrationAddress: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
    ip: '85.34.78.112',
    city: 'Istanbul',
    country: 'Turkey',
    zipCode: '34732'
  }
};

export const TEST_ADDRESSES = {
  SHIPPING: {
    contactName: 'Jane Doe',
    city: 'Istanbul',
    country: 'Turkey',
    address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
    zipCode: '34742'
  },
  BILLING: {
    contactName: 'Jane Doe',
    city: 'Istanbul',
    country: 'Turkey',
    address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
    zipCode: '34742'
  }
};

// Test ürünleri
export const TEST_PRODUCTS = [
  {
    id: 'BI101',
    name: 'Test Ürün 1',
    category1: 'Elektronik',
    category2: 'Aksesuarlar',
    price: '10.00'
  },
  {
    id: 'BI102',
    name: 'Test Ürün 2',
    category1: 'Giyim',
    category2: 'Ayakkabı',
    price: '25.50'
  }
];

// Fiyat formatı yardımcı fonksiyonları
export const formatPrice = {
  // Kuruş cinsinden fiyatı TL'ye çevir
  toTL: (kurusPrice: number): string => {
    return (kurusPrice / 100).toFixed(2);
  },
  
  // TL cinsinden fiyatı kuruşa çevir
  toKurus: (tlPrice: number): number => {
    return Math.round(tlPrice * 100);
  },
  
  // Türkçe para formatı
  toTurkishFormat: (kurusPrice: number): string => {
    return (kurusPrice / 100).toLocaleString('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
};

// Test ortamı kontrol fonksiyonu
export const isTestEnvironment = (): boolean => {
  return process.env.NODE_ENV !== 'production';
};

// API URL'leri
export const API_URLS = {
  SANDBOX: 'https://sandbox-api.iyzipay.com',
  PRODUCTION: 'https://api.iyzipay.com'
};

export default {
  TEST_CARDS,
  TEST_BUYER_INFO,
  TEST_ADDRESSES,
  TEST_PRODUCTS,
  formatPrice,
  isTestEnvironment,
  API_URLS
};
