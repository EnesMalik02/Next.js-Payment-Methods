import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutForm, IYZICO_CONSTANTS } from '@/lib/iyzico';

export async function POST(request: NextRequest) {
  try {
    const { cartItems, buyerInfo } = await request.json();

    // Calculate total
    const totalPrice = cartItems.reduce((total: number, item: any) => total + (item.price * item.quantity), 0);

    // Convert to Iyzico format
    const basketItems = cartItems.map((item: any) => ({
      id: `BI${item.id}`,
      name: item.name,
      category1: item.category,
      category2: 'General',
      itemType: IYZICO_CONSTANTS.BASKET_ITEM_TYPE.PHYSICAL,
      price: (item.price * item.quantity / 100).toFixed(2)
    }));

    // Get IP
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';

    // Generate IDs
    const timestamp = Date.now();
    const conversationId = `${timestamp}`;
    const basketId = `B${timestamp}`;

    // Payment request
    const paymentRequest = {
      locale: IYZICO_CONSTANTS.LOCALE.TR,
      conversationId,
      price: (totalPrice / 100).toFixed(2),
      paidPrice: (totalPrice / 100).toFixed(2),
      currency: IYZICO_CONSTANTS.CURRENCY.TRY,
      basketId,
      paymentGroup: IYZICO_CONSTANTS.PAYMENT_GROUP.PRODUCT,
      callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/iyzico/callback`,
      enabledInstallments: [1],
      buyer: {
        id: buyerInfo.id,
        name: buyerInfo.name,
        surname: buyerInfo.surname,
        gsmNumber: buyerInfo.phone,
        email: buyerInfo.email,
        identityNumber: '11111111111',
        lastLoginDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
        registrationDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
        registrationAddress: buyerInfo.address,
        ip,
        city: buyerInfo.city,
        country: 'Turkey',
        zipCode: buyerInfo.zipCode
      },
      shippingAddress: {
        contactName: `${buyerInfo.name} ${buyerInfo.surname}`,
        city: buyerInfo.city,
        country: 'Turkey',
        address: buyerInfo.address,
        zipCode: buyerInfo.zipCode
      },
      billingAddress: {
        contactName: `${buyerInfo.name} ${buyerInfo.surname}`,
        city: buyerInfo.city,
        country: 'Turkey',
        address: buyerInfo.address,
        zipCode: buyerInfo.zipCode
      },
      basketItems
    };

    const result = await createCheckoutForm(paymentRequest);

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
