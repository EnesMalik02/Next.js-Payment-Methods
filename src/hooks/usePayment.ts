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

      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems,
          buyerInfo
        })
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
