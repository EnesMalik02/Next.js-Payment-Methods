import { NextRequest, NextResponse } from 'next/server';
import { retrievePayment } from '@/lib/iyzico';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const token = formData.get('token') as string;

    console.log('Callback POST çağrısı alındı:', { token: token ? 'mevcut' : 'yok' });

    // Base URL kontrolü
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    console.log('Base URL:', baseUrl);

    if (!token) {
      console.error('Token bulunamadı');
      const redirectUrl = new URL('/order-result', baseUrl);
      redirectUrl.searchParams.set('status', 'error');
      redirectUrl.searchParams.set('message', 'Token bulunamadı');
      return NextResponse.redirect(redirectUrl.toString());
    }

    console.log('Token ile ödeme sonucu sorgulanıyor:', token);

    // Ödeme sonucunu Iyzico'dan al
    const result = await retrievePayment(token);
    console.log('Iyzico yanıtı:', result);

    if (result.status === 'success') {
      // Ödeme başarılı
      const paymentId = result.paymentId;
      const paidPrice = result.paidPrice;
      const currency = result.currency;

      // Burada veritabanına kayıt yapabilirsiniz
      console.log('Başarılı ödeme:', {
        paymentId,
        paidPrice,
        currency,
        token
      });

      const successUrl = new URL('/order-result', baseUrl);
      successUrl.searchParams.set('status', 'success');
      successUrl.searchParams.set('paymentId', paymentId || '');
      successUrl.searchParams.set('amount', paidPrice || '');
      successUrl.searchParams.set('currency', currency || 'TRY');
      
      return NextResponse.redirect(successUrl.toString());
    } else {
      // Ödeme başarısız
      console.log('Başarısız ödeme:', result);
      
      const failureUrl = new URL('/order-result', baseUrl);
      failureUrl.searchParams.set('status', 'failure');
      failureUrl.searchParams.set('message', result.errorMessage || 'Ödeme başarısız');
      
      return NextResponse.redirect(failureUrl.toString());
    }

  } catch (error) {
    console.error('Callback hatası:', error);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const errorUrl = new URL('/order-result', baseUrl);
    errorUrl.searchParams.set('status', 'error');
    errorUrl.searchParams.set('message', 'Sunucu hatası');
    
    return NextResponse.redirect(errorUrl.toString());
  }
}

// GET request'i de destekleyelim (bazı durumlarda Iyzico GET kullanabilir)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  console.log('Callback GET çağrısı alındı:', { token: token ? 'mevcut' : 'yok', baseUrl });

  if (!token) {
    console.error('GET: Token bulunamadı');
    const errorUrl = new URL('/order-result', baseUrl);
    errorUrl.searchParams.set('status', 'error');
    errorUrl.searchParams.set('message', 'Token bulunamadı');
    return NextResponse.redirect(errorUrl.toString());
  }

  try {
    console.log('GET: Token ile ödeme sonucu sorgulanıyor:', token);
    const result = await retrievePayment(token);
    console.log('GET: Iyzico yanıtı:', result);

    if (result.status === 'success') {
      console.log('GET: Ödeme başarılı, yönlendiriliyor');
      const successUrl = new URL('/order-result', baseUrl);
      successUrl.searchParams.set('status', 'success');
      successUrl.searchParams.set('paymentId', result.paymentId || '');
      successUrl.searchParams.set('amount', result.paidPrice || '');
      successUrl.searchParams.set('currency', result.currency || 'TRY');
      return NextResponse.redirect(successUrl.toString());
    } else {
      console.log('GET: Ödeme başarısız:', result.errorMessage);
      const failureUrl = new URL('/order-result', baseUrl);
      failureUrl.searchParams.set('status', 'failure');
      failureUrl.searchParams.set('message', result.errorMessage || 'Ödeme başarısız');
      return NextResponse.redirect(failureUrl.toString());
    }
  } catch (error) {
    console.error('Callback GET hatası:', error);
    const errorUrl = new URL('/order-result', baseUrl);
    errorUrl.searchParams.set('status', 'error');
    errorUrl.searchParams.set('message', 'Sunucu hatası');
    return NextResponse.redirect(errorUrl.toString());
  }
}
