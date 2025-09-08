// /hooks/usePayment.ts

import { useState } from 'react';

// Bu tipleri ayrı bir dosyadan import ettiğinizi varsayıyorum.
// Örn: /types/index.ts
export interface Product {
  id: number;
  name: string;
  // ...diğer alanlar
}

export interface BuyerFormData {
  name: string;
  surname: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  tckn?: string; // Bireysel için
  companyTitle?: string; // Kurumsal için
  taxOffice?: string; // Kurumsal için
  taxNumber?: string; // Kurumsal için
}

export const usePayment = () => {
  const [loading, setLoading] = useState(false);

  // NOT: Fonksiyonun aldığı parametreler değişti.
  // Artık form bilgisini ve ödeme yöntemini de alıyor.
  const buyProduct = async (
    product: Product,
    formData: BuyerFormData,
    paymentMethod: 'iyzico' | 'stripe' // Örnek
  ) => {
    setLoading(true);
    let errorMsg: string | null = null;

    try {
      // 1. Backend'e gönderilecek ÇOK BASİT ve GÜVENLİ OLMAYAN BİLGİLERİ HAZIRLA
      // Fiyat, sepet gibi kritik hiçbir şey burada yok.
      const payload = {
        productId: product.id,
        quantity: 1,
        formData: formData,
        paymentMethod: paymentMethod,
      };

      // 2. Kendi API endpoint'ine bu basit bilgileri gönder
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        // Eğer sunucu hata döndürürse, hatayı yakala
        throw new Error(result.error || 'Ödeme işlemi başlatılamadı.');
      }

      // 3. Sunucudan gelen cevaba göre işlem yap
      // Sunucu sana bir yönlendirme adresi verdiyse, oraya git.
      if (result.redirectUrl) {
        window.location.href = result.redirectUrl;
      } else {
        // Stripe gibi farklı bir akış varsa burada yönetilebilir.
        console.log('Ödeme başlatıldı:', result);
      }
    } catch (error) {
      errorMsg = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu.';
      // Hata durumunda kullanıcıya bilgi vermek için burada state güncellenebilir
      // veya bir bildirim gösterilebilir.
      console.error(errorMsg);
    } finally {
      setLoading(false);
    }

    // Fonksiyonun bir hata olup olmadığını bildirmesi faydalı olabilir.
    if (errorMsg) {
      return { success: false, message: errorMsg };
    }
    return { success: true };
  };

  return { loading, buyProduct };
};