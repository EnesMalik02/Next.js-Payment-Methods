import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutForm } from '@/lib/iyzico';

export async function POST(request: NextRequest) {
  try {
    const { paymentRequestData } = await request.json();

    // Get IP and add to buyer info
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    paymentRequestData.buyer.ip = ip;

    const result = await createCheckoutForm(paymentRequestData);

    return NextResponse.json({
      status: result.status,
      paymentPageUrl: result.paymentPageUrl,
      errorMessage: result.errorMessage
    });

  } catch (error) {
    return NextResponse.json({
      status: 'failure',
      errorMessage: 'Server error'
    }, { status: 500 });
  }
}