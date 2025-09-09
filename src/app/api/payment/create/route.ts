import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '@/lib/payment/provider';
import { getProductById, getPriceById, Product } from '@/lib/products';

interface CheckoutItem {
  totalPrice: number;
  product: Product;
  quantity: number;
}

interface CheckoutData {
  items: CheckoutItem[];
  grandTotal: number;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Frontend'den gelen doğru anahtar isimlerini kullanıyoruz: 'user_form_data' ve 'items'
    const { user_form_data, items, payment_channel } = await request.json();

    // Basit bir kontrol: Gerekli veriler geldi mi?
    if (!user_form_data || !items || !payment_channel) {
      return NextResponse.json({
        status: 'failure',
        errorMessage: 'Eksik veya hatalı istek verisi Form Data.'
      }, { status: 400 });
    }

    // Items array'inin geçerli olduğunu kontrol et
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({
        status: 'failure',
        errorMessage: 'Geçersiz ürün listesi.'
      }, { status: 400 });
    }

    const checkoutItems: CheckoutItem[] = items.map((item: { id: number, quantity: number }) => {
      const product = getProductById(item.id);
      const unitPrice = getPriceById(item.id);
      
      // Ürün bulunamadıysa hata fırlat
      if (!product) {
        throw new Error(`ID ${item.id} ile ürün bulunamadı`);
      }
      
      if (unitPrice === null || unitPrice === undefined) {
        throw new Error(`ID ${item.id} için fiyat bulunamadı`);
      }

      return {
        totalPrice: unitPrice * item.quantity, // Birim fiyat x miktar
        product: product,
        quantity: item.quantity
      };
    });

    // Toplam sepet tutarını hesapla
    const grandTotal = checkoutItems.reduce((sum, item) => sum + item.totalPrice, 0);

    // CheckoutItems listesine grand total'ı ekle
    const checkoutData: CheckoutData = {
      items: checkoutItems,
      grandTotal: grandTotal
    };

    console.log({ checkoutData });

    // 5. PaymentService'e güncellenmiş ve doğru veriyi gönderiyoruz.
    const result = await new PaymentService(payment_channel).createCheckoutForm(user_form_data, checkoutData);

    return NextResponse.json({
      status: result.status,
      paymentPageUrl: result.paymentPageUrl,
      errorMessage: result.errorMessage
    });

  } catch (error) {
    console.error("API Hatası:", error);
    
    // Özel hata mesajları için kontrol
    if (error instanceof Error && error.message.includes('bulunamadı')) {
      return NextResponse.json({
        status: 'failure',
        errorMessage: error.message
      }, { status: 404 });
    }
    
    return NextResponse.json({
      status: 'failure',
      errorMessage: 'Sunucuda beklenmedik bir hata oluştu.'
    }, { status: 500 });
  }
}