import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutForm, IYZICO_CONSTANTS } from '@/lib/iyzico';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: string;
  description: string;
}

interface BuyerInfo {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
}

export async function POST(request: NextRequest) {
  try {
    const { cartItems, buyerInfo }: { cartItems: CartItem[], buyerInfo: BuyerInfo } = await request.json();

    // Validasyon
    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { status: 'failure', errorMessage: 'Sepet boş' },
        { status: 400 }
      );
    }

    if (!buyerInfo.name || !buyerInfo.surname || !buyerInfo.email || !buyerInfo.phone) {
      return NextResponse.json(
        { status: 'failure', errorMessage: 'Gerekli müşteri bilgileri eksik' },
        { status: 400 }
      );
    }

    // Toplam fiyatı hesapla
    const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const paidPrice = totalPrice; // Kargo vs. eklenebilir

    // Sepet öğelerini Iyzico formatına çevir
    const basketItems = cartItems.map((item, index) => ({
      id: `BI${item.id}`,
      name: item.name,
      category1: item.category,
      category2: 'Genel',
      itemType: IYZICO_CONSTANTS.BASKET_ITEM_TYPE.PHYSICAL,
      price: (item.price * item.quantity / 100).toFixed(2) // Kuruş cinsinden
    }));

    // İstek IP'sini al
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(/, /)[0] : request.headers.get('x-real-ip') || '127.0.0.1';

    // Her ödeme için benzersiz ID'ler oluştur
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const conversationId = `${timestamp}_${randomId}`;
    const basketId = `B${timestamp}_${randomId}`;

    console.log('Yeni ödeme talebi:', {
      conversationId,
      basketId,
      totalPrice: (totalPrice / 100).toFixed(2),
      buyerEmail: buyerInfo.email
    });

    // Iyzico ödeme formu verilerini hazırla
    const paymentRequest = {
      locale: IYZICO_CONSTANTS.LOCALE.TR,
      conversationId: conversationId,
      price: (totalPrice / 100).toFixed(2), // Kuruş cinsinden
      paidPrice: (paidPrice / 100).toFixed(2), // Kuruş cinsinden
      currency: IYZICO_CONSTANTS.CURRENCY.TRY,
      basketId: basketId,
      paymentGroup: IYZICO_CONSTANTS.PAYMENT_GROUP.PRODUCT,
      callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/iyzico/callback`,
      enabledInstallments: [1, 2, 3, 6, 9, 12],
      buyer: {
        id: buyerInfo.id,
        name: buyerInfo.name,
        surname: buyerInfo.surname,
        gsmNumber: buyerInfo.phone,
        email: buyerInfo.email,
        identityNumber: '11111111111', // Test için sabit değer
        lastLoginDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
        registrationDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
        registrationAddress: buyerInfo.address || 'Test Adres',
        ip: ip,
        city: buyerInfo.city,
        country: 'Turkey',
        zipCode: buyerInfo.zipCode
      },
      shippingAddress: {
        contactName: `${buyerInfo.name} ${buyerInfo.surname}`,
        city: buyerInfo.city,
        country: 'Turkey',
        address: buyerInfo.address || 'Test Adres',
        zipCode: buyerInfo.zipCode
      },
      billingAddress: {
        contactName: `${buyerInfo.name} ${buyerInfo.surname}`,
        city: buyerInfo.city,
        country: 'Turkey',
        address: buyerInfo.address || 'Test Adres',
        zipCode: buyerInfo.zipCode
      },
      basketItems: basketItems
    };

    // Iyzico checkout form oluştur
    const result = await createCheckoutForm(paymentRequest);

    if (result.status === 'success') {
      return NextResponse.json({
        status: 'success',
        token: result.token,
        checkoutFormContent: result.checkoutFormContent,
        paymentPageUrl: result.paymentPageUrl
      });
    } else {
      return NextResponse.json({
        status: 'failure',
        errorMessage: result.errorMessage || 'Ödeme formu oluşturulamadı'
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Ödeme oluşturma hatası:', error);
    return NextResponse.json({
      status: 'failure',
      errorMessage: 'Sunucu hatası'
    }, { status: 500 });
  }
}
