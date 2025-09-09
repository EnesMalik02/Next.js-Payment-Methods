import { useState } from 'react';
// BuyerFormData ve CartItem tiplerini checkout sayfasından veya merkezi bir tipler dosyasından import edin
import { BuyerFormData } from '@/app/checkout/page';
import { Product } from '@/lib/products';
export interface CartItem extends Product {
  quantity: number;
}

export const usePayment = () => {
  const [loading, setLoading] = useState(false);

  const buyProduct = async (
    items: CartItem[],
    formData: BuyerFormData,
  ) => {
    try {
      setLoading(true);

      const user_form_data = {
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
      };

      const payment_channel = 'iyzico';


      // ID ve adet içeren 'items' dizisini doğrudan gönderiyoruz.
      const itemsToSend = items.map((item: CartItem) => ({
        id: item.id,
        quantity: item.quantity,
      }));

      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Sunucuya, ID ve adet içeren 'items' dizisini doğrudan gönderiyoruz.
        body: JSON.stringify({
          user_form_data,
          items: itemsToSend, // Artık ek bir map'lemeye gerek yok.
          payment_channel,
        })
      });

      // Sunucudan 500 gibi bir hata dönerse, bunu yakalayıp daha anlamlı bir mesaj gösteriyoruz.
      if (!response.ok) {
          const errorData = await response.json();
          // Sunucudan gelen hata mesajını kullan, yoksa genel bir mesaj göster.
          throw new Error(errorData.errorMessage || `Sunucu hatası: ${response.status}`);
      }

      const result = await response.json();

      if (result.status === 'success') {
        if (result.paymentPageUrl) {
          window.location.href = result.paymentPageUrl;
        }
      } else {
        alert("Ödeme hatası: " + result.errorMessage);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu';
      alert("İstek sırasında bir hata oluştu: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { loading, buyProduct };
};

