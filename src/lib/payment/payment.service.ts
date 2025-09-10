import { IyzicoProvider } from './providers/iyzico';  
import { IPaymentProvider } from './payment.interface';
import { SupportedProviders } from './payment.interface';
export class PaymentService implements IPaymentProvider {
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

  createCheckoutForm(userData: any, product_data: any): Promise<any> {
    return this.provider.createCheckoutForm(userData, product_data);
  }

  verifyPaymentDetails(token: string): Promise<any> {
    return this.provider.verifyPaymentDetails(token);
  }
}
