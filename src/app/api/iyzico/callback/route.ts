import { NextRequest, NextResponse } from 'next/server';
import { retrieveCheckoutForm } from '@/lib/iyzico';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const token = formData.get('token') as string;

    console.log('Callback POST çağrısı alındı:', { token: token ? 'mevcut' : 'yok' });

    if (!token) {
      console.error('Token bulunamadı');
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/order-result?status=error&message=Token bulunamadı`
      );
    }

    console.log('Token ile ödeme sonucu sorgulanıyor:', token);

    // Ödeme sonucunu Iyzico'dan al
    const result = await retrieveCheckoutForm(token);
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

      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/order-result?status=success&paymentId=${paymentId}&amount=${paidPrice}&currency=${currency}`
      );
    } else {
      // Ödeme başarısız
      console.log('Başarısız ödeme:', result);
      
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/order-result?status=failure&message=${encodeURIComponent(result.errorMessage || 'Ödeme başarısız')}`
      );
    }

  } catch (error) {
    console.error('Callback hatası:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/order-result?status=error&message=${encodeURIComponent('Sunucu hatası')}`
    );
  }
}

// GET request'i de destekleyelim (bazı durumlarda Iyzico GET kullanabilir)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  console.log('Callback GET çağrısı alındı:', { token: token ? 'mevcut' : 'yok' });

  if (!token) {
    console.error('GET: Token bulunamadı');
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/order-result?status=error&message=Token bulunamadı`
    );
  }

  try {
    console.log('GET: Token ile ödeme sonucu sorgulanıyor:', token);
    const result = await retrieveCheckoutForm(token);
    console.log('GET: Iyzico yanıtı:', result);

    if (result.status === 'success') {
      console.log('GET: Ödeme başarılı, yönlendiriliyor');
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/order-result?status=success&paymentId=${result.paymentId}&amount=${result.paidPrice}&currency=${result.currency}`
      );
    } else {
      console.log('GET: Ödeme başarısız:', result.errorMessage);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/order-result?status=failure&message=${encodeURIComponent(result.errorMessage || 'Ödeme başarısız')}`
      );
    }
  } catch (error) {
    console.error('Callback GET hatası:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/order-result?status=error&message=${encodeURIComponent('Sunucu hatası')}`
    );
  }
}
