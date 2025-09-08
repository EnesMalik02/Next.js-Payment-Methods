// /lib/payment/iyzico.ts

import Iyzipay from 'iyzipay';

// Tipleri tanımlayarak kodumuzu daha güvenli hale getirelim
// Bu, API endpoint'imizin hazırlayacağı standart sipariş paketidir
interface OrderData {
  orderId: string;
  totalPrice: string; // "500.00" gibi
  buyerInfo: any; // Formdan gelen tüm bilgiler
  product: any; // Veritabanından çekilen ürün bilgileri
}

// Iyzico'dan dönen başarılı sonucun tip tanımı
interface IyzicoResult {
  status: 'success' | 'failure';
  paymentPageUrl?: string;
  errorMessage?: string;
  // ... diğer dönebilecek alanlar
}

// Iyzico client'ını bir kere başta oluşturuyoruz. Bu kısım doğru.
const iyzico = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY!,
  secretKey: process.env.IYZICO_SECRET_KEY!,
  uri: process.env.NODE_ENV === 'production' 
    ? 'https://api.iyzipay.com'
    : 'https://sandbox-api.iyzipay.com'
});

/**
 * Bu fonksiyon, standart bir sipariş verisini alır,
 * onu Iyzico'nun anlayacağı formata çevirir ve ödeme başlatma isteği gönderir.
 * Artık fonksiyonun adı daha genel: createPayment
 */
export const createPayment = (orderData: OrderData): Promise<{ redirectUrl?: string; status: string; }> => {
  return new Promise((resolve, reject) => {

    // Iyzico'ya özel, karmaşık objeyi ARTIK BURADA OLUŞTURUYORUZ.
    // Bu mantık API endpoint'inden buraya taşındı.
    const paymentRequestData = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: orderData.orderId,
      price: orderData.totalPrice,
      paidPrice: orderData.totalPrice,
      currency: Iyzipay.CURRENCY.TRY,
      basketId: `B${orderData.orderId}`,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/callback`,
      enabledInstallments: [1],
      buyer: {
        id: orderData.buyerInfo.id || `BY${orderData.orderId}`,
        name: orderData.buyerInfo.name,
        surname: orderData.buyerInfo.surname,
        gsmNumber: orderData.buyerInfo.phone,
        email: orderData.buyerInfo.email,
        identityNumber: orderData.buyerInfo.tckn || '11111111111', // Formdan TCKN alınmalı
        lastLoginDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
        registrationDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
        registrationAddress: orderData.buyerInfo.address,
        city: orderData.buyerInfo.city,
        country: 'Turkey',
        zipCode: orderData.buyerInfo.zipCode
      },
      shippingAddress: {
        contactName: `${orderData.buyerInfo.name} ${orderData.buyerInfo.surname}`,
        city: orderData.buyerInfo.city,
        country: 'Turkey',
        address: orderData.buyerInfo.address,
        zipCode: orderData.buyerInfo.zipCode
      },
      billingAddress: {
        contactName: `${orderData.buyerInfo.name} ${orderData.buyerInfo.surname}`,
        city: orderData.buyerInfo.city,
        country: 'Turkey',
        address: orderData.buyerInfo.address,
        zipCode: orderData.buyerInfo.zipCode
      },
      basketItems: [{
        id: orderData.product.id.toString(),
        name: orderData.product.name,
        category1: orderData.product.category || 'General',
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
        price: orderData.totalPrice
      }]
    };

    // NOT: `checkoutFormInitialize` yerine `payment.create` kullanmak
    // doğrudan ödeme sayfası URL'ini verdiği için daha pratiktir.
    iyzico.payment.create(paymentRequestData, (err: any, result: IyzicoResult) => {
      if (err) {
        return reject(err);
      }
      
      if (result.status === 'success') {
        // Kontrol kulesinin anlayacağı standart bir formatta cevap dönüyoruz.
        resolve({
          redirectUrl: result.paymentPageUrl,
          status: result.status,
        });
      } else {
        // Hata durumunda da standart bir formatta reject ediyoruz.
        reject(new Error(result.errorMessage || 'Iyzico returned a failure status.'));
      }
    });
  });
};


// BU FONKSİYON ZATEN DOĞRU VE ÇOK İŞE YARAYACAK.
// Bunu ödeme yapıldıktan sonra callback endpoint'inde kullanacağız.
// O yüzden şimdilik olduğu gibi kalabilir.
export const retrievePaymentDetails = (token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    iyzico.checkoutForm.retrieve({
      locale: Iyzipay.LOCALE.TR,
      token: token,
    }, (err: any, result: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};