import { NextRequest, NextResponse } from 'next/server';
import { retrieveCheckoutForm } from '@/lib/iyzico';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { status: 'failure', errorMessage: 'Token gerekli' },
        { status: 400 }
      );
    }

    // Ödeme sonucunu Iyzico'dan al
    const result = await retrieveCheckoutForm(token);

    return NextResponse.json(result);

  } catch (error) {
    console.error('Ödeme sorgulama hatası:', error);
    return NextResponse.json({
      status: 'failure',
      errorMessage: 'Sunucu hatası'
    }, { status: 500 });
  }
}
