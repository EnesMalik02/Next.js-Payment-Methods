import Iyzipay from 'iyzipay';

const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY,
  secretKey: process.env.IYZICO_SECRET_KEY,
  uri: process.env.NODE_ENV === 'production' 
    ? 'https://api.iyzipay.com'
    : 'https://sandbox-api.iyzipay.com'
});

export const IYZICO_CONSTANTS = {
  LOCALE: {
    TR: Iyzipay.LOCALE.TR
  },
  CURRENCY: {
    TRY: Iyzipay.CURRENCY.TRY
  },
  PAYMENT_GROUP: {
    PRODUCT: Iyzipay.PAYMENT_GROUP.PRODUCT
  },
  BASKET_ITEM_TYPE: {
    PHYSICAL: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL
  }
};

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
