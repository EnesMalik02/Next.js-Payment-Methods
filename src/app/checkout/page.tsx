// app/checkout/page.tsx

"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getProductById , Product} from '@/lib/products'; 
import BuyButton from '@/components/BuyButton';

// types/index.ts

// Alıcı bilgilerini içeren formun yapısını tanımlayan interface
export interface BuyerFormData {
    // Her iki fatura tipi için de zorunlu alanlar
    name: string;
    surname: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    zipCode: string;
  
    // Sadece bireysel fatura için zorunlu olan alan (opsiyonel)
    tckn?: string;
  
    // Sadece kurumsal fatura için zorunlu olan alanlar (opsiyonel)
    companyTitle?: string;
    taxOffice?: string;
    taxNumber?: string;
  }

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 2a5 5 0 00-5 5v3a5 5 0 00-5 5v2a5 5 0 005 5h10a5 5 0 005-5v-2a5 5 0 00-5-5V7a5 5 0 00-5-5zm-3 7a3 3 0 006 0V7a3 3 0 10-6 0v2z" clipRule="evenodd" />
    </svg>
);

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const [product, setProduct] = useState<Product | null>(null);

  // 2. useState'den <BuyerFormData> tip tanımı kaldırıldı.
  // TypeScript, başlangıç objesinin yapısına bakarak tipi otomatik olarak anlayacaktır.
  const [formData, setFormData] = useState<BuyerFormData>({
    name: '',
    surname: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    tckn: '',
    companyTitle: '',
    taxOffice: '',
    taxNumber: ''
  });

  const [invoiceType, setInvoiceType] = useState<'individual' | 'corporate'>('individual');

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    // URL'den 'product_id' yerine 'id' parametresini okuyoruz (önceki adımda böyle yapmıştık)
    const productId = searchParams.get('id');

    if (productId) {
      const foundProduct = getProductById(Number(productId));
      setProduct(foundProduct || null);
    }
  }, [searchParams]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Ürün bilgisi yükleniyor veya ürün bulunamadı...</p>
      </div>
    );
  }

  // Fiyatları TL cinsinden gösterim için hazırlıyoruz
  const displayPrice = product.price; 
  const displayTax = displayPrice * 0.20; 
  const displayTotal = displayPrice + displayTax;

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8 flex items-center justify-center">
      <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-10">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* === SOL TARAF: FORM === */}
          <div className="w-full lg:w-3/5">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Fatura ve Teslimat Bilgileri</h2>
            
            <div className="flex items-center space-x-4 mb-6">
              <label className="cursor-pointer">
                <input type="radio" name="invoiceType" value="individual" checked={invoiceType === 'individual'} onChange={() => setInvoiceType('individual')} className="mr-2"/>
                Bireysel Fatura
              </label>
              <label className="cursor-pointer">
                <input type="radio" name="invoiceType" value="corporate" checked={invoiceType === 'corporate'} onChange={() => setInvoiceType('corporate')} className="mr-2"/>
                Kurumsal Fatura
              </label>
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="name" value={formData.name} onChange={handleFormChange} placeholder="Ad" className="block w-full rounded-md border-gray-300 p-3" required />
                <input type="text" name="surname" value={formData.surname} onChange={handleFormChange} placeholder="Soyad" className="block w-full rounded-md border-gray-300 p-3" required />
              </div>
              <input type="email" name="email" value={formData.email} onChange={handleFormChange} placeholder="E-posta Adresi" className="block w-full rounded-md border-gray-300 p-3" required />
              <input type="tel" name="phone" value={formData.phone} onChange={handleFormChange} placeholder="Telefon (+90 5XX XXX XX XX)" className="block w-full rounded-md border-gray-300 p-3" required />
              <textarea name="address" value={formData.address} onChange={handleFormChange} placeholder="Adres" className="block w-full rounded-md border-gray-300 p-3" rows={3} required />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="city" value={formData.city} onChange={handleFormChange} placeholder="Şehir" className="block w-full rounded-md border-gray-300 p-3" required />
                <input type="text" name="zipCode" value={formData.zipCode} onChange={handleFormChange} placeholder="Posta Kodu" className="block w-full rounded-md border-gray-300 p-3" />
              </div>

              {invoiceType === 'corporate' && (
                <div className="space-y-4 pt-4 border-t">
                  <input type="text" name="companyTitle" value={formData.companyTitle} onChange={handleFormChange} placeholder="Firma Unvanı" className="block w-full rounded-md border-gray-300 p-3" required />
                  <input type="text" name="taxOffice" value={formData.taxOffice} onChange={handleFormChange} placeholder="Vergi Dairesi" className="block w-full rounded-md border-gray-300 p-3" required />
                  <input type="text" name="taxNumber" value={formData.taxNumber} onChange={handleFormChange} placeholder="Vergi Numarası" className="block w-full rounded-md border-gray-300 p-3" required />
                </div>
              )}
              {invoiceType === 'individual' && (
                <div className="pt-4 border-t">
                  <input type="text" name="tckn" value={formData.tckn} onChange={handleFormChange} placeholder="T.C. Kimlik Numarası" className="block w-full rounded-md border-gray-300 p-3" required />
                </div>
              )}
            </form>
          </div>
          
          {/* === SAĞ TARAF: SİPARİŞ ÖZETİ VE SATIN AL BUTONU === */}
          <div className="w-full lg:w-2/5 flex flex-col">
            <div className="bg-gray-50 p-6 rounded-lg border">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-3">Sipariş Özeti</h3>
              <div className="flex items-center space-x-4">
                <img src={product.imageUrl} alt={product.name} className="w-24 h-24 rounded-md object-cover" />
                <div>
                  <p className="font-bold text-gray-900">{product.name}</p>
                  <p className="text-gray-600">1 x {displayPrice.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</p>
                </div>
              </div>
            </div>
            
            <div className="flex-grow"></div>

            <div className="mt-8">
              <div className="space-y-2 py-4 border-t">
                <div className="flex justify-between"><span>Ara Toplam</span><span>{displayPrice.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span></div>
                <div className="flex justify-between"><span>KDV (%20)</span><span>{displayTax.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span></div>
                <div className="flex justify-between text-xl font-bold mt-2"><span>Toplam</span><span>{displayTotal.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span></div>
              </div>
              <BuyButton
                product={product}
                formData={formData as BuyerFormData}
                onSuccess={(result) => {
                  console.log('Ödeme başarılı:', result);
                }}
                onError={(error) => {
                  console.error('Ödeme hatası:', error);
                  alert(error);
                }}
              />
              <p className="text-xs text-center text-gray-500 mt-4"><LockIcon /> Güvenli Ödeme SSL Sertifikası ile Korunmaktadır.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}