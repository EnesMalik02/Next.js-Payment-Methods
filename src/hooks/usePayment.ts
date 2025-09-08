import { useState } from 'react';

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
}

export const usePayment = () => {
  const [loading, setLoading] = useState(false);

  const buyProduct = async (
    product: Product,
    onSuccess?: (result: any) => void,
    onError?: (error: string) => void
  ) => {
    try {
      setLoading(true);

      // Minimal buyer info
      const buyerInfo = {
        id: `BY${Date.now()}`,
        name: 'Demo',
        surname: 'User',
        email: 'demo@example.com',
        phone: '+905551234567',
        address: 'Demo Address',
        city: 'Istanbul',
        zipCode: '34000'
      };

      // Convert to cart format
      const cartItems = [{
        ...product,
        quantity: 1
      }];

      // Calculate total
      const totalPrice = cartItems.reduce((total: number, item: any) => total + (item.price * item.quantity), 0);

      // Convert to Iyzico format
      const basketItems = cartItems.map((item: any) => ({
        id: `BI${item.id}`,
        name: item.name,
        category1: item.category,
        category2: 'General',
        itemType: 'PHYSICAL', // IYZICO_CONSTANTS.BASKET_ITEM_TYPE.PHYSICAL
        price: (item.price * item.quantity / 100).toFixed(2)
      }));

      // Generate IDs
      const timestamp = Date.now();
      const conversationId = `${timestamp}`;
      const basketId = `B${timestamp}`;

      // Prepare payment request data
      const paymentRequestData = {
        locale: 'tr', // IYZICO_CONSTANTS.LOCALE.TR
        conversationId,
        price: (totalPrice / 100).toFixed(2),
        paidPrice: (totalPrice / 100).toFixed(2),
        currency: 'TRY', // IYZICO_CONSTANTS.CURRENCY.TRY
        basketId,
        paymentGroup: 'PRODUCT', // IYZICO_CONSTANTS.PAYMENT_GROUP.PRODUCT
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

      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentRequestData })
      });

      const result = await response.json();

      if (result.status === 'success') {
        if (result.paymentPageUrl) {
          window.location.href = result.paymentPageUrl;
        }
        onSuccess?.(result);
      } else {
        onError?.(result.errorMessage || 'Ödeme hatası');
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { loading, buyProduct };
};