import { IyzicoProvider } from './providers/iyzico';  
// import { StripeProvider } from '../providers/stripe.provider'; // Gelecekte eklemek için

// Desteklenen ödeme sağlayıcılarının tiplerini tanımlayalım.
export type SupportedProviders = 'iyzico' | 'stripe';

/**
 * Bu sınıf, seçilen ödeme sağlayıcısı (Iyzico, Stripe vb.) için bir aracı görevi görür.
 * Dış dünyanın doğrudan sağlayıcı sınıflarıyla konuşması yerine bu servis ile iletişim kurmasını sağlar.
 */
export class PaymentService {
  private provider: any;

  constructor(providerName: SupportedProviders) {
    this.provider = this.getProvider(providerName);
  }

  private getProvider(providerName: SupportedProviders): any {
    switch (providerName) {
      case 'iyzico':
        return new IyzicoProvider();
      // case 'stripe':
      //   return new StripeProvider(); // Gelecekte Stripe eklenince bu satır açılacak.
      default:
        throw new Error(`Desteklenmeyen ödeme sağlayıcısı: ${providerName}`);
    }
  }

  createCheckoutForm(userData: any, product: any): Promise<any> {
    return this.provider.createCheckoutForm(userData, product);
  }

  retrievePaymentDetails(token: string): Promise<any> {
    return this.provider.retrievePaymentDetails(token);
  }
}

/**
 * Belirtilen sağlayıcı adına göre yeni bir PaymentService örneği oluşturan fabrika fonksiyonu.
 * API rotamızda bu fonksiyonu kullanarak anlık servisler oluşturacağız.
 * @param providerName 'iyzico' veya 'stripe' gibi desteklenen bir sağlayıcı adı.
 * @returns Yapılandırılmış bir PaymentService örneği.
 */
export const getPaymentService = (providerName: SupportedProviders): PaymentService => {
  if (!providerName) {
    throw new Error('Ödeme sağlayıcı adı belirtilmelidir.');
  }
  return new PaymentService(providerName);
};

