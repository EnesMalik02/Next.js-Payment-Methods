import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '@/lib/payment/provider';
import { getProductById } from '@/lib/products';

export async function POST(request: NextRequest) {
  try {
    const { form_data, product_id, payment_channel } = await request.json();

    // Databaseden ürün fiyatını al
    const product_data = await getProductById(product_id as number);

    const result = await new PaymentService(payment_channel).createCheckoutForm(form_data, product_data);

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