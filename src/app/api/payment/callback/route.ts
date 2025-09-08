import { NextRequest, NextResponse } from 'next/server';
import { retrievePaymentDetails } from '@/lib/payment/iyzico';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

// Helper function to create redirect URL
const createRedirectUrl = (status: string, data?: any) => {
  // Başarı durumunda orderId'nin data içinde gelmesi zorunludur.
  // Bu ID, Next.js'teki dinamik [order-id] segmentini dolduracak.
  const orderId = data?.orderId || data?.merchantOid || 'bilinmeyen-siparis';

  // URL'i oluştururken orderId'yi doğrudan path'e ekliyoruz.
  const url = new URL(`/order-confirmation/${orderId}`, BASE_URL);

  // Geri kalan parametreleri searchParams olarak eklemeye devam ediyoruz.
  url.searchParams.set('status', status);
  
  switch (status) {
    case 'success':
      url.searchParams.set('paymentId', data?.paymentId || '');
      url.searchParams.set('amount', data?.paidPrice || '');
      url.searchParams.set('currency', data?.currency || 'TRY');
      break;
    case 'failure':
    case 'error':
      url.searchParams.set('message', data?.message || 'Bilinmeyen bir hata oluştu.');
      break;
  }
  
  return url.toString();
};

// Helper function to process payment
const processPayment = async (token: string) => {
  console.log('Token ile ödeme sonucu sorgulanıyor:', token);
  
  const result = await retrievePaymentDetails(token);
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
    const token = formData.get('token') as string;

    console.log('📥 Callback POST çağrısı:', { 
      token: token ? '✅ mevcut' : '❌ yok',
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
    });

    if (!token) {
      console.error('❌ Token bulunamadı');
      return NextResponse.redirect(`${BASE_URL}/order-result?status=error&message=Token bulunamadı`);
    }

    const redirectUrl = await processPayment(token);
    return NextResponse.redirect(redirectUrl);

  } catch (error) {
    console.error('❌ Callback POST hatası:', error);
    return NextResponse.redirect(`${BASE_URL}/order-result?status=error&message=Sunucu hatası`);
  }
}