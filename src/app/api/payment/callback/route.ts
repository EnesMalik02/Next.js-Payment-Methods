import { NextRequest, NextResponse } from 'next/server';
import { PaymentService, SupportedProviders } from '@/lib/payment/provider';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

// Helper function to create redirect URL
const createRedirectUrl = (status: string, data?: any) => {
  const url = new URL('/order-confirmation/order-id', BASE_URL);
  url.searchParams.set('status', status);
  
  switch (status) {
    case 'success':
      url.searchParams.set('paymentId', data?.paymentId || '');
      url.searchParams.set('amount', data?.paidPrice || '');
      url.searchParams.set('currency', data?.currency || 'TRY');
      break;
    case 'failure':
    case 'error':
      url.searchParams.set('message', data?.message || 'Bilinmeyen hata');
      break;
  }
  
  return url.toString();
};

// Helper function to process payment
const processPayment = async (token: string, provider: SupportedProviders) => {

  console.log('Token ile ödeme sonucu sorgulanıyor:', token);
  
  const result = await new PaymentService(provider).retrievePaymentDetails(token);
  console.log('Iyzico yanıtı:', result);

  if (result.status === 'success') {
    console.log('Başarılı ödeme:', {
      paymentId: result.paymentId,
      paidPrice: result.paidPrice,
      currency: result.currency,
      token
    });
    
    return createRedirectUrl('success', result);
  } else {
    console.log('Başarısız ödeme:', result);
    return createRedirectUrl('failure', { message: result.errorMessage || 'Ödeme başarısız' });
  }
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    //console.log('📥 Callback POST çağrısı:', { formData });
    const token = formData.get('token') as string;
    const provider = request.nextUrl.searchParams.get('provider');

    //console.log('📥 Callback POST çağrısı:', { 
      //token: token ? '✅ mevcut' : '❌ yok',
      //userAgent: request.headers.get('user-agent'),
      //ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
    //});

    if (!token) {
      console.error('❌ Token bulunamadı');
      return NextResponse.redirect(`${BASE_URL}/order-result?status=error&message=Token bulunamadı`);
    }

    const redirectUrl = await processPayment(token, provider as SupportedProviders);
    return NextResponse.redirect(redirectUrl);

  } catch (error) {
    console.error('❌ Callback POST hatası:', error);
    return NextResponse.redirect(`${BASE_URL}/order-result?status=error&message=Sunucu hatası`);
  }
}