
/**
 * Tüm ödeme sağlayıcılarının (Iyzico, Stripe, PayTR vb.)
 * uygulaması gereken zorunlu metodları ve veri yapılarını tanımlar.
 * Bu arayüz, PaymentService'in farklı sağlayıcılarla
 * tip-güvenli bir şekilde çalışmasını sağlar.
 */
export interface IPaymentProvider {

  /**
   * Sağlayıcıya özel bir ödeme formu (checkout form) oluşturur.
   * @param userData Kullanıcı detayları.
   * @param productData Satın alınacak ürün ve sepet bilgileri.
   * @returns Sağlayıcının ödeme formu sonucunu içeren bir Promise.
   */
  createCheckoutForm(userData: any, productData: any): Promise<any>;

  /**
   * Bir ödeme işleminin detaylarını, genellikle bir 'token' aracılığıyla sorgular.
   * @param token Ödeme işlemine ait tekil (unique) token.
   * @returns Ödeme detaylarını içeren bir Promise.
   */
  verifyPaymentDetails(token: string): Promise<any>;
}

export type SupportedProviders = 'iyzico'; 
