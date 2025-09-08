// app/checkout/page.tsx

"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
// Ürünleri ve ürünü ID ile bulma fonksiyonunu import ediyoruz.
import { getProductById, type Product } from '@/lib/products'; 
import BuyButton from '@/components/BuyButton';

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 2a5 5 0 00-5 5v3a5 5 0 00-5 5v2a5 5 0 005 5h10a5 5 0 005-5v-2a5 5 0 00-5-5V7a5 5 0 00-5-5zm-3 7a3 3 0 006 0V7a3 3 0 10-6 0v2z" clipRule="evenodd" />
  </svg>
);

export default function SimpleCheckoutPage() {
  const searchParams = useSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // 1. URL'den 'id' parametresini al.
    const productId = searchParams.get('id');

    if (productId) {
      // 2. ID'yi sayıya çevir ve bu ID'ye sahip ürünü bul.
      const foundProduct = getProductById(Number(productId));
      if (foundProduct) {
        // 3. Ürünü state'e set et ve fiyat hesaplamalarını yap.
        setProduct(foundProduct);
        const calculatedTax = foundProduct.price * 0.08;
        setTax(calculatedTax);
        setTotal(foundProduct.price + calculatedTax);
      }
    }
  }, [searchParams]);

  // Ürün bulunana kadar veya geçerli bir ID yoksa yükleme ekranı göster.
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Ürün bilgileri yükleniyor veya geçersiz ürün ID'si...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* === SOL SÜTUN: KULLANICI BİLGİLERİ FORMU === */}
          <div className="w-full lg:w-2/3">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Fatura Bilgileri</h2>
            {/* Form alanı... */}
            <form className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-posta Adresi</label>
                <input type="email" id="email" name="email" className="block w-full rounded-md border-gray-300 shadow-sm p-3 mt-1" placeholder="you@example.com" />
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Ad Soyad</label>
                <input type="text" id="name" name="name" className="block w-full rounded-md border-gray-300 shadow-sm p-3 mt-1" placeholder="Adınız Soyadınız" />
              </div>
              <div className="pt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Ödeme Detayları</h3>
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <p className="text-center text-gray-600">Güvenli ödeme formu buraya gelecek.</p>
                </div>
              </div>
            </form>
          </div>
          
          {/* === SAĞ SÜTUN: SİPARİŞ ÖZETİ VE ÖDE BUTONU === */}
          <div className="w-full lg:w-1/3 flex flex-col">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-3">Sipariş Özeti</h3>
              <div className="flex items-center space-x-4">
                <img src={product.imageUrl} alt={product.name} className="w-20 h-20 rounded-md" />
                <div>
                  <p className="font-semibold text-gray-900">{product.name}</p>
                  <p className="text-gray-600">1 x {product.price.toLocaleString('tr-TR')} TL</p>
                </div>
              </div>
            </div>
            
            <div className="flex-grow"></div>

            <div className="mt-8">
              <div className="space-y-2 py-4 border-t border-gray-200">
                <div className="flex justify-between text-gray-600"><span>Ara Toplam</span><span>{product.price.toLocaleString('tr-TR')} TL</span></div>
                <div className="flex justify-between text-gray-600"><span>Vergi (%8)</span><span>{tax.toLocaleString('tr-TR')} TL</span></div>
                <div className="flex justify-between text-xl font-bold text-gray-900 mt-2"><span>Toplam</span><span>{total.toLocaleString('tr-TR')} TL</span></div>
              </div>
              <BuyButton
                product={product}
                buttonText="Öde"
              />
              <p className="text-xs text-center text-gray-500 mt-4"><LockIcon /> Güvenli Ödeme</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}