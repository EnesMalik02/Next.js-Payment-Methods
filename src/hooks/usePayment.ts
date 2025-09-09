import { useState } from 'react';
import { BuyerFormData } from '@/app/checkout/page';

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
    formData: BuyerFormData,
    onSuccess?: (result: any) => void,
    onError?: (error: string) => void
  ) => {
    try {
      setLoading(true);

      const user = {
        name: formData.name,
        surname: formData.surname,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        zipCode: formData.zipCode,
        tckn: formData.tckn,
        companyTitle: formData.companyTitle,
        taxOffice: formData.taxOffice,
        taxNumber: formData.taxNumber,
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