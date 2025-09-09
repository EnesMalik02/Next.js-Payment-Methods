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
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-4 w-4 inline-block mr-1 text-green-600" 
        viewBox="0 0 20 20" 
        fill="currentColor"
    >
        <path 
            fillRule="evenodd" 
            d="M10 2a5 5 0 00-5 5v3a5 5 0 00-5 5v2a5 5 0 005 5h10a5 5 0 005-5v-2a5 5 0 00-5-5V7a5 5 0 00-5-5zm-3 7a3 3 0 006 0V7a3 3 0 10-6 0v2z" 
            clipRule="evenodd" 
        />
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
        const productId = searchParams.get('product_id');

        if (productId) {
            const foundProduct = getProductById(Number(productId));
            setProduct(foundProduct || null);
        }
    }, [searchParams]);

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-700 text-lg font-medium">Ürün bilgisi yükleniyor...</p>
                    <p className="text-gray-500 text-sm mt-2">Lütfen bekleyiniz</p>
                </div>
            </div>
        );
    }

    // Fiyatları TL cinsinden gösterim için hazırlıyoruz
    const displayPrice = product.price; 
    const displayTax = displayPrice * 0.20; 
    const displayTotal = displayPrice + displayTax;

    return (
        <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen p-4 sm:p-8">
            <div className="w-full max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                        Ödeme Sayfası
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Siparişinizi tamamlamak için bilgilerinizi doldurun
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    <div className="flex flex-col xl:flex-row">
                        
                        {/* === SOL TARAF: FORM === */}
                        <div className="w-full xl:w-3/5 p-8 lg:p-12">
                            {/* Form Başlığı */}
                            <div className="mb-8">
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                                    Fatura ve Teslimat Bilgileri
                                </h2>
                                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                            </div>
                            
                            {/* Fatura Tipi Seçimi */}
                            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                                <h3 className="text-lg font-semibold text-gray-700 mb-4">Fatura Tipi</h3>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <label className="flex items-center cursor-pointer bg-white rounded-xl p-4 border-2 hover:border-blue-300 transition-all duration-200 flex-1">
                                        <input 
                                            type="radio" 
                                            name="invoiceType" 
                                            value="individual" 
                                            checked={invoiceType === 'individual'} 
                                            onChange={() => setInvoiceType('individual')} 
                                            className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500"
                                        />
                                        <div>
                                            <div className="font-medium text-gray-800">Bireysel Fatura</div>
                                            <div className="text-sm text-gray-500">Şahıs adına fatura</div>
                                        </div>
                                    </label>
                                    <label className="flex items-center cursor-pointer bg-white rounded-xl p-4 border-2 hover:border-blue-300 transition-all duration-200 flex-1">
                                        <input 
                                            type="radio" 
                                            name="invoiceType" 
                                            value="corporate" 
                                            checked={invoiceType === 'corporate'} 
                                            onChange={() => setInvoiceType('corporate')} 
                                            className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500"
                                        />
                                        <div>
                                            <div className="font-medium text-gray-800">Kurumsal Fatura</div>
                                            <div className="text-sm text-gray-500">Firma adına fatura</div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Form Alanları */}
                            <form className="space-y-6">
                                {/* Kişisel Bilgiler */}
                                <div className="space-y-4">
                                    <h4 className="text-lg font-semibold text-gray-700 flex items-center">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                            <span className="text-blue-600 font-bold text-sm">1</span>
                                        </div>
                                        Kişisel Bilgiler
                                    </h4>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">Ad *</label>
                                            <input 
                                                type="text" 
                                                name="name" 
                                                value={formData.name} 
                                                onChange={handleFormChange} 
                                                placeholder="Adınızı girin" 
                                                className="block w-full rounded-xl border-gray-300 border-2 p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white" 
                                                required 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">Soyad *</label>
                                            <input 
                                                type="text" 
                                                name="surname" 
                                                value={formData.surname} 
                                                onChange={handleFormChange} 
                                                placeholder="Soyadınızı girin" 
                                                className="block w-full rounded-xl border-gray-300 border-2 p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white" 
                                                required 
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">E-posta Adresi *</label>
                                        <input 
                                            type="email" 
                                            name="email" 
                                            value={formData.email} 
                                            onChange={handleFormChange} 
                                            placeholder="ornek@email.com" 
                                            className="block w-full rounded-xl border-gray-300 border-2 p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white" 
                                            required 
                                        />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Telefon *</label>
                                        <input 
                                            type="tel" 
                                            name="phone" 
                                            value={formData.phone} 
                                            onChange={handleFormChange} 
                                            placeholder="+90 5XX XXX XX XX" 
                                            className="block w-full rounded-xl border-gray-300 border-2 p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white" 
                                            required 
                                        />
                                    </div>
                                </div>

                                {/* Adres Bilgileri */}
                                <div className="space-y-4 pt-6 border-t border-gray-200">
                                    <h4 className="text-lg font-semibold text-gray-700 flex items-center">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                            <span className="text-blue-600 font-bold text-sm">2</span>
                                        </div>
                                        Adres Bilgileri
                                    </h4>
                                    
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Adres *</label>
                                        <textarea 
                                            name="address" 
                                            value={formData.address} 
                                            onChange={handleFormChange} 
                                            placeholder="Tam adresinizi yazın..." 
                                            className="block w-full rounded-xl border-gray-300 border-2 p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white resize-none" 
                                            rows={4} 
                                            required 
                                        />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">Şehir *</label>
                                            <input 
                                                type="text" 
                                                name="city" 
                                                value={formData.city} 
                                                onChange={handleFormChange} 
                                                placeholder="İstanbul" 
                                                className="block w-full rounded-xl border-gray-300 border-2 p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white" 
                                                required 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">Posta Kodu</label>
                                            <input 
                                                type="text" 
                                                name="zipCode" 
                                                value={formData.zipCode} 
                                                onChange={handleFormChange} 
                                                placeholder="34000" 
                                                className="block w-full rounded-xl border-gray-300 border-2 p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white" 
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Fatura Bilgileri */}
                                <div className="pt-6 border-t border-gray-200">
                                    <h4 className="text-lg font-semibold text-gray-700 flex items-center mb-4">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                            <span className="text-blue-600 font-bold text-sm">3</span>
                                        </div>
                                        Fatura Bilgileri
                                    </h4>

                                    {invoiceType === 'corporate' && (
                                        <div className="space-y-4 bg-blue-50 p-6 rounded-xl">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">Firma Unvanı *</label>
                                                <input 
                                                    type="text" 
                                                    name="companyTitle" 
                                                    value={formData.companyTitle} 
                                                    onChange={handleFormChange} 
                                                    placeholder="ABC Şirketi Ltd. Şti." 
                                                    className="block w-full rounded-xl border-gray-300 border-2 p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white" 
                                                    required 
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-gray-700">Vergi Dairesi *</label>
                                                    <input 
                                                        type="text" 
                                                        name="taxOffice" 
                                                        value={formData.taxOffice} 
                                                        onChange={handleFormChange} 
                                                        placeholder="Kadıköy Vergi Dairesi" 
                                                        className="block w-full rounded-xl border-gray-300 border-2 p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white" 
                                                        required 
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-gray-700">Vergi Numarası *</label>
                                                    <input 
                                                        type="text" 
                                                        name="taxNumber" 
                                                        value={formData.taxNumber} 
                                                        onChange={handleFormChange} 
                                                        placeholder="1234567890" 
                                                        className="block w-full rounded-xl border-gray-300 border-2 p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white" 
                                                        required 
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {invoiceType === 'individual' && (
                                        <div className="bg-green-50 p-6 rounded-xl">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">T.C. Kimlik Numarası *</label>
                                                <input 
                                                    type="text" 
                                                    name="tckn" 
                                                    value={formData.tckn} 
                                                    onChange={handleFormChange} 
                                                    placeholder="12345678901" 
                                                    className="block w-full rounded-xl border-gray-300 border-2 p-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white" 
                                                    required 
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </form>
                        </div>
                        
                        {/* === SAĞ TARAF: SİPARİŞ ÖZETİ VE SATIN AL BUTONU === */}
                        <div className="w-full xl:w-2/5 bg-gray-50 p-8 lg:p-12 flex flex-col">
                            {/* Sipariş Özeti */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border">
                                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                        <span className="text-green-600 font-bold text-sm">✓</span>
                                    </div>
                                    Sipariş Özeti
                                </h3>
                                
                                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                                    <div className="relative">
                                        <img 
                                            src={product.imageUrl} 
                                            alt={product.name} 
                                            className="w-20 h-20 rounded-xl object-cover shadow-sm" 
                                        />
                                        <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                                            1
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-900 text-lg leading-tight">{product.name}</p>
                                        <p className="text-blue-600 font-semibold text-lg">
                                            {displayPrice.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex-grow"></div>

                            {/* Fiyat Detayları ve Satın Al */}
                            <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border">
                                <div className="space-y-4">
                                    <div className="flex justify-between text-gray-600 text-lg">
                                        <span>Ara Toplam</span>
                                        <span className="font-medium">
                                            {displayPrice.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 text-lg">
                                        <span>KDV (%20)</span>
                                        <span className="font-medium">
                                            {displayTax.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                                        </span>
                                    </div>
                                    <div className="border-t-2 border-gray-200 pt-4">
                                        <div className="flex justify-between text-2xl font-bold text-gray-800">
                                            <span>Toplam</span>
                                            <span className="text-blue-600">
                                                {displayTotal.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-6">
                                    <BuyButton
                                        product={product}
                                        formData={formData as BuyerFormData}
                                    />
                                </div>
                                
                                <div className="mt-4 text-center">
                                    <p className="text-xs text-gray-500 flex items-center justify-center">
                                        <LockIcon />
                                        Güvenli Ödeme - SSL Sertifikası ile Korunmaktadır
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}