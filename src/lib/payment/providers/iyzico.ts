import Iyzipay from 'iyzipay';
import { v4 as uuidv4 } from 'uuid';

/**
 * Iyzico ödeme sağlayıcısı için tüm mantığı içeren sınıf.
 * IPaymentProvider arayüzünü uygulayarak, PaymentService ile tam uyumlu çalışır.
 */
export class IyzicoProvider {
  private iyzipay: any;

  constructor() {
    // Iyzipay instance'ını sınıf içinde, constructor'da bir kez oluşturuyoruz.
    // Bu, ayarların merkezi ve yönetilebilir olmasını sağlar.
    this.iyzipay = new Iyzipay({
      apiKey: process.env.IYZICO_API_KEY,
      secretKey: process.env.IYZICO_SECRET_KEY,
      uri: process.env.NODE_ENV === 'production'
        ? 'https://api.iyzipay.com'
        : 'https://sandbox-api.iyzipay.com',
    });
  }

  /**
   * Iyzico için bir ödeme formu başlatır.
   * @param userData Alıcı (kullanıcı) bilgileri.
   * @param product Satın alınacak ürün bilgileri.
   * @returns Iyzico'dan dönen ödeme formu sonucu.
   */
  public createCheckoutForm(userData: any, product_data: any): Promise<any> {
    // Basket items'ı Iyzico formatına dönüştür
    const basketItems = product_data.items.map((item: any) => ({
      id: item.product.id.toString(),
      name: item.product.name,
      category1: item.product.category || 'Genel',
      category2: item.product.subcategory || 'Alt Kategori',
      itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
      price: item.totalPrice.toFixed(2) // Toplam fiyat (miktar * birim fiyat)
    }));

    const paymentData = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: uuidv4(),
      price: product_data.grandTotal.toFixed(2), // Iyzico API'ı fiyatı string olarak bekler.
      paidPrice: product_data.grandTotal.toFixed(2),
      currency: Iyzipay.CURRENCY.TRY,
      installment: '1',
      basketId: uuidv4(),
      paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/payment/callback?provider=iyzico`,
      buyer: {
        id: 'BY789',
        name: 'John',
        surname: 'Doe',
        gsmNumber: '+905350000000',
        email: 'email@email.com',
        identityNumber: '74300864791',
        lastLoginDate: '2015-10-05 12:43:35',
        registrationDate: '2013-04-21 15:12:09',
        registrationAddress: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
        ip: '85.34.78.112',
        city: 'Istanbul',
        country: 'Turkey',
        zipCode: '34732'
      },
      shippingAddress: {
        contactName: `${userData.name} ${userData.surname}`,
        city: userData.city || 'Anytown',
        country: userData.country || 'USA',
        address: userData.registrationAddress || '123 Main St, Anytown, USA',
        zipCode: userData.zipCode || '12345',
      },
      billingAddress: {
        contactName: `${userData.name} ${userData.surname}`,
        city: userData.city || 'Anytown',
        country: userData.country || 'USA',
        address: userData.registrationAddress || '123 Main St, Anytown, USA',
        zipCode: userData.zipCode || '12345',
      },
      basketItems: basketItems
    };

    return new Promise((resolve, reject) => {
      this.iyzipay.checkoutFormInitialize.create(paymentData, (err: any, result: any) => {
        if (err) {
          console.error("Iyzico form oluşturma hatası:", err);
          return reject(err);
        }
        resolve(result);
      });
    });
  }

  /**
   * Bir ödeme işleminin detaylarını token ile sorgular.
   * @param token Ödeme işlemine ait tekil token.
   * @returns Ödeme detayı sonucu.
   */
  public retrievePaymentDetails(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.iyzipay.checkoutForm.retrieve({
        locale: Iyzipay.LOCALE.TR,
        conversationId: uuidv4(), // Her istek için yeni bir conversationId oluşturmak iyidir.
        token: token,
      }, (err: any, result: any) => {
        if (err) {
          console.error("Iyzico ödeme detayı sorgulama hatası:", err);
          return reject(err);
        }
        resolve(result);
      });
    });
  }
}