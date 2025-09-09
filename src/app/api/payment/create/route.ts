import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '@/lib/payment/provider';
import { getProductById } from '@/lib/products';

export async function POST(request: NextRequest) {
  try {
    // 1. Frontend'den gelen doğru anahtar isimlerini kullanıyoruz: 'user_form_data' ve 'items'
    const { user_form_data, items, payment_channel } = await request.json();

    // Basit bir kontrol: Gerekli veriler geldi mi?
    if (!user_form_data){
      return NextResponse.json({
        status: 'failure',
        errorMessage: 'Eksik veya hatalı istek verisi Form Data.'
      }, { status: 400 });
    }

    if (!items || !items.length) {
      return NextResponse.json({
        status: 'failure',
        errorMessage: 'Eksik veya hatalı istek verisi Items.'
      }, { status: 400 });
    }

    // 2. 'items' dizisinden tüm ürün ID'lerini topluyoruz.
    const checkoutItems = getProductById(items.id);
    // 5. PaymentService'e güncellenmiş ve doğru veriyi gönderiyoruz.
    const result = await new PaymentService(payment_channel).createCheckoutForm(user_form_data, checkoutItems);

    return NextResponse.json({
      status: result.status,
      paymentPageUrl: result.paymentPageUrl,
      errorMessage: result.errorMessage
    });

  } catch (error) {
    console.error("API Hatası:", error); // Hataları sunucu konsoluna loglamak önemlidir.
    return NextResponse.json({
      status: 'failure',
      errorMessage: 'Sunucuda beklenmedik bir hata oluştu.'
    }, { status: 500 });
  }
}

