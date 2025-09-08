import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '@/lib/payment/provider';

export async function POST(request: NextRequest) {
  try {
    const { user, product, payment_channel } = await request.json();

    const result = await new PaymentService(payment_channel).createCheckoutForm(user, product);

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