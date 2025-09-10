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
    const { user_form_data, items, payment_channel } = await request.json();

    // Veri kontrolü
    if (!user_form_data || !items || !payment_channel || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({
        status: 'failure',
        errorMessage: 'Eksik veya hatalı istek verisi.'
      }, { status: 400 });
    }

    // Checkout items oluştur
    const checkoutItems: CheckoutItem[] = items.map(item => {
      const product = getProductById(item.id);
      const unitPrice = getPriceById(item.id);
      
      if (!product) throw new Error(`ID ${item.id} ile ürün bulunamadı`);
      if (unitPrice == null) throw new Error(`ID ${item.id} için fiyat bulunamadı`);

      return {
        totalPrice: unitPrice * item.quantity,
        product,
        quantity: item.quantity
      };
    });

    // Checkout data hazırla
    const checkoutData: CheckoutData = {
      items: checkoutItems,
      grandTotal: checkoutItems.reduce((sum, item) => sum + item.totalPrice, 0)
    };

    console.log({ checkoutData });

    // Ödeme sayfası oluştur
    const result = await new PaymentService(payment_channel).createCheckoutForm(user_form_data, checkoutData);

    return NextResponse.json({
      status: result.status,
      paymentPageUrl: result.paymentPageUrl,
      errorMessage: result.errorMessage
    });

  } catch (error) {
    console.error("API Hatası:", error);
    
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