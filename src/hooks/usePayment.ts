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

      const user = {
        id: '00000000000000000000',
        name: 'John Doe',
        surname: 'Doe',
        phone: '5555555555',
        email: 'john.doe@example.com',
      }

      const payment_channel = 'iyzico';

      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user, product, payment_channel })
      });

      const result = await response.json();

      console.log({ result });

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