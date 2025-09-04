import Iyzipay from 'iyzipay';

// Iyzico konfigürasyonu
const iyzipayConfig = {
  apiKey: process.env.IYZICO_API_KEY!,
  secretKey: process.env.IYZICO_SECRET_KEY!,
  uri: process.env.NODE_ENV === 'test' 
    ? 'https://sandbox-api.iyzipay.com'  // Test ortamı
    : 'https://api.iyzipay.com'  // Canlı ortam
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

// Doğrudan ödeme oluşturma fonksiyonu
export const createPayment = (paymentData: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    iyzipay.payment.create(paymentData, (err: any, result: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

// Ödeme iptal etme fonksiyonu
export const cancelPayment = (paymentId: string, ip: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const request = {
      locale: IYZICO_CONSTANTS.LOCALE.TR,
      conversationId: Date.now().toString(),
      paymentId: paymentId,
      ip: ip
    };

    iyzipay.cancel.create(request, (err: any, result: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

// İade oluşturma fonksiyonu
export const createRefund = (paymentTransactionId: string, price: string, ip: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const request = {
      locale: IYZICO_CONSTANTS.LOCALE.TR,
      conversationId: Date.now().toString(),
      paymentTransactionId: paymentTransactionId,
      price: price,
      ip: ip
    };

    iyzipay.refund.create(request, (err: any, result: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

export default iyzipay;
