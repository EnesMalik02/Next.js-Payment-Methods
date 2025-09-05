import { NextRequest, NextResponse } from 'next/server';
import { retrievePaymentDetails } from '@/lib/iyzico';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

// Helper function to create redirect URL
const createRedirectUrl = (status: string, data?: any) => {
  const url = new URL('/order-result', BASE_URL);
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

    console.log('Callback POST çağrısı alındı:', { token: token ? 'mevcut' : 'yok' });

    if (!token) {
      console.error('Token bulunamadı');
      return NextResponse.redirect(createRedirectUrl('error', { message: 'Token bulunamadı' }));
    }

    const redirectUrl = await processPayment(token);
    return NextResponse.redirect(redirectUrl);

  } catch (error) {
    console.error('Callback POST hatası:', error);
    return NextResponse.redirect(createRedirectUrl('error', { message: 'Sunucu hatası' }));
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    console.log('Callback GET çağrısı alındı:', { token: token ? 'mevcut' : 'yok' });

    if (!token) {
      console.error('GET: Token bulunamadı');
      return NextResponse.redirect(createRedirectUrl('error', { message: 'Token bulunamadı' }));
    }

    const redirectUrl = await processPayment(token);
    return NextResponse.redirect(redirectUrl);

  } catch (error) {
    console.error('Callback GET hatası:', error);
    return NextResponse.redirect(createRedirectUrl('error', { message: 'Sunucu hatası' }));
  }
}