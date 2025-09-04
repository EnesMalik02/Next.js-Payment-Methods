import Iyzipay from 'iyzipay';

// Iyzico konfigürasyonu
const iyzipayConfig = {
  apiKey: process.env.IYZICO_API_KEY,
  secretKey: process.env.IYZICO_SECRET_KEY,
  uri: process.env.NODE_ENV === 'production' 
    ? 'https://api.iyzipay.com'  // Canlı ortam
    : 'https://sandbox-api.iyzipay.com'  // Test ortamı (development/test)
};

// Iyzico instance'ını oluştur
const iyzipay = new Iyzipay(iyzipayConfig);

// Sabitler
export const IYZICO_CONSTANTS = {
  LOCALE: {
    TR: Iyzipay.LOCALE.TR,
    EN: Iyzipay.LOCALE.EN
  },
  CURRENCY: {
    TRY: Iyzipay.CURRENCY.TRY,
    USD: Iyzipay.CURRENCY.USD,
    EUR: Iyzipay.CURRENCY.EUR,
    GBP: Iyzipay.CURRENCY.GBP
  },
  PAYMENT_CHANNEL: {
    WEB: Iyzipay.PAYMENT_CHANNEL.WEB,
    MOBILE: Iyzipay.PAYMENT_CHANNEL.MOBILE,
    MOBILE_WEB: Iyzipay.PAYMENT_CHANNEL.MOBILE_WEB,
    MOBILE_IOS: Iyzipay.PAYMENT_CHANNEL.MOBILE_IOS,
    MOBILE_ANDROID: Iyzipay.PAYMENT_CHANNEL.MOBILE_ANDROID,
    MOBILE_WINDOWS: Iyzipay.PAYMENT_CHANNEL.MOBILE_WINDOWS,
    MOBILE_TABLET: Iyzipay.PAYMENT_CHANNEL.MOBILE_TABLET,
    MOBILE_PHONE: Iyzipay.PAYMENT_CHANNEL.MOBILE_PHONE
  },
  PAYMENT_GROUP: {
    PRODUCT: Iyzipay.PAYMENT_GROUP.PRODUCT,
    LISTING: Iyzipay.PAYMENT_GROUP.LISTING,
    SUBSCRIPTION: Iyzipay.PAYMENT_GROUP.SUBSCRIPTION
  },
  BASKET_ITEM_TYPE: {
    PHYSICAL: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
    VIRTUAL: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL
  }
};

// Ödeme formu oluşturma fonksiyonu
export const createCheckoutForm = (paymentData: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    iyzipay.checkoutFormInitialize.create(paymentData, (err: any, result: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

// Ödeme sonucunu alma fonksiyonu
export const retrieveCheckoutForm = (token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const request = {
      locale: IYZICO_CONSTANTS.LOCALE.TR,
      token: token
    };

    iyzipay.checkoutForm.retrieve(request, (err: any, result: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};


export default iyzipay;
