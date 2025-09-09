// app/checkout/page.tsx

"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getProductById } from '@/lib/products';
import BuyButton from '@/components/CheckoutBuyButton';
import { CartItem } from '@/hooks/usePayment';

// Form verisi tipi
export interface BuyerFormData {
    name: string;
    surname: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    zipCode: string;
    tckn?: string; // Bireysel için opsiyonel
    companyTitle?: string; // Kurumsal için opsiyonel
    taxOffice?: string;
    taxNumber?: string;
}

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1 text-green-600" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 2a5 5 0 00-5 5v3a5 5 0 00-5 5v2a5 5 0 005 5h10a5 5 0 005-5v-2a5 5 0 00-5-5V7a5 5 0 00-5-5zm-3 7a3 3 0 006 0V7a3 3 0 10-6 0v2z" clipRule="evenodd" />
    </svg>
);

export default function CheckoutPage() {    
    const searchParams = useSearchParams();
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [formData, setFormData] = useState<BuyerFormData>({
        name: 'Enes Malik',
        surname: 'Arı',
        phone: '006654',
        email: 'enesar@gmail.com',
        address: 'Kadıköy',
        city: 'Kadıköy',
        zipCode: '34000',
        tckn: '12345678901',
        companyTitle: 'Enes Arı',
        taxOffice: 'Kadıköy',
        taxNumber: '1234567890'
    });

    const [invoiceType, setInvoiceType] = useState<'individual' | 'corporate'>('individual');

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev: BuyerFormData) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        try {
            if (searchParams.get('buyNow') === 'true') {
                const productId = searchParams.get('product_id');
                if (productId) {
                    const foundProduct = getProductById(Number(productId));
                    if (foundProduct) {  
                        setItems([{ ...foundProduct, quantity: 1 }]);
                    }
                }
            } else {
                const storedCart = localStorage.getItem('shoppingCart');
                if (storedCart) {
                    setItems(JSON.parse(storedCart));
                }
            }
        } catch (error) {
            console.error("Ödeme verileri işlenirken hata oluştu:", error);
            setItems([]);
        } finally {
            setIsLoading(false);
        }
    }, [searchParams]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                    <p className="text-white text-lg font-medium">Sipariş bilgileri yükleniyor...</p>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
                <div className="text-center p-8 bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700">
                    <h2 className="text-2xl font-bold text-white">Sepetiniz Boş</h2>
                    <p className="text-gray-300 mt-2">Ödeme yapmak için sepetinizde en az bir ürün bulunmalıdır.</p>
                    <a href="/" className="mt-6 inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105">
                        Alışverişe Devam Et
                    </a>
                </div>
            </div>
        );
    }

    const subTotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const subTotalWithoutTax = subTotal / 1.20; // KDV hariç
    const taxAmount = subTotal - subTotalWithoutTax; // KDV tutarı
    const total = subTotal; // KDV dahil toplam

    return (
        <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 min-h-screen p-4 sm:p-8">
            <div className="w-full max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-2">Ödeme Sayfası</h1>
                    <p className="text-gray-300 text-lg">Siparişinizi tamamlamak için bilgilerinizi doldurun</p>
                </div>

                <div className="bg-gray-800/60 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-gray-700">
                    <div className="flex flex-col xl:flex-row">
                        {/* === SOL TARAF: FORM === */}
                        <div className="w-full xl:w-3/5 p-8 lg:p-12">
                            <div className="mb-8">
                                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Fatura ve Teslimat Bilgileri</h2>
                                <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"></div>
                            </div>
                            <div className="bg-gray-700/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-600">
                                <h3 className="text-lg font-semibold text-white mb-4">Fatura Tipi</h3>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <label className="flex items-center cursor-pointer bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 border-2 border-gray-600 hover:border-blue-400 transition-all duration-300 flex-1 group">
                                        <input type="radio" name="invoiceType" value="individual" checked={invoiceType === 'individual'} onChange={() => setInvoiceType('individual')} className="mr-3 w-4 h-4 text-blue-500 focus:ring-blue-400 bg-gray-700 border-gray-600" />
                                        <div>
                                            <div className="font-medium text-white group-hover:text-blue-200">Bireysel Fatura</div>
                                            <div className="text-sm text-gray-400">Şahıs adına fatura</div>
                                        </div>
                                    </label>
                                    <label className="flex items-center cursor-pointer bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 border-2 border-gray-600 hover:border-blue-400 transition-all duration-300 flex-1 group">
                                        <input type="radio" name="invoiceType" value="corporate" checked={invoiceType === 'corporate'} onChange={() => setInvoiceType('corporate')} className="mr-3 w-4 h-4 text-blue-500 focus:ring-blue-400 bg-gray-700 border-gray-600" />
                                        <div>
                                            <div className="font-medium text-white group-hover:text-blue-200">Kurumsal Fatura</div>
                                            <div className="text-sm text-gray-400">Firma adına fatura</div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                            <form className="space-y-6">
                                <div className="space-y-4">
                                    <h4 className="text-lg font-semibold text-white flex items-center">
                                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mr-3 shadow-lg"><span className="text-white font-bold text-sm">1</span></div>
                                        Kişisel Bilgiler
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-300">Ad *</label>
                                            <input 
                                                type="text" 
                                                name="name" 
                                                value={formData.name} 
                                                onChange={handleFormChange} 
                                                placeholder="Adınızı girin" 
                                                className="block w-full rounded-xl border-2 border-gray-600 bg-gray-800/80 backdrop-blur-sm p-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 shadow-inner" 
                                                required 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-300">Soyad *</label>
                                            <input 
                                                type="text" 
                                                name="surname" 
                                                value={formData.surname} 
                                                onChange={handleFormChange} 
                                                placeholder="Soyadınızı girin" 
                                                className="block w-full rounded-xl border-2 border-gray-600 bg-gray-800/80 backdrop-blur-sm p-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 shadow-inner" 
                                                required 
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-300">E-posta Adresi *</label>
                                        <input 
                                            type="email" 
                                            name="email" 
                                            value={formData.email} 
                                            onChange={handleFormChange} 
                                            placeholder="ornek@email.com" 
                                            className="block w-full rounded-xl border-2 border-gray-600 bg-gray-800/80 backdrop-blur-sm p-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 shadow-inner" 
                                            required 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-300">Telefon *</label>
                                        <input 
                                            type="tel" 
                                            name="phone" 
                                            value={formData.phone} 
                                            onChange={handleFormChange} 
                                            placeholder="+90 5XX XXX XX XX" 
                                            className="block w-full rounded-xl border-2 border-gray-600 bg-gray-800/80 backdrop-blur-sm p-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 shadow-inner" 
                                            required 
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4 pt-6 border-t border-gray-600">
                                    <h4 className="text-lg font-semibold text-white flex items-center">
                                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mr-3 shadow-lg"><span className="text-white font-bold text-sm">2</span></div>
                                        Adres Bilgileri
                                    </h4>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-300">Adres *</label>
                                        <textarea 
                                            name="address" 
                                            value={formData.address} 
                                            onChange={handleFormChange} 
                                            placeholder="Tam adresinizi yazın..." 
                                            className="block w-full rounded-xl border-2 border-gray-600 bg-gray-800/80 backdrop-blur-sm p-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 shadow-inner resize-none" 
                                            rows={4} 
                                            required 
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-300">Şehir *</label>
                                            <input 
                                                type="text" 
                                                name="city" 
                                                value={formData.city} 
                                                onChange={handleFormChange} 
                                                placeholder="İstanbul" 
                                                className="block w-full rounded-xl border-2 border-gray-600 bg-gray-800/80 backdrop-blur-sm p-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 shadow-inner" 
                                                required 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-300">Posta Kodu</label>
                                            <input 
                                                type="text" 
                                                name="zipCode" 
                                                value={formData.zipCode} 
                                                onChange={handleFormChange} 
                                                placeholder="34000" 
                                                className="block w-full rounded-xl border-2 border-gray-600 bg-gray-800/80 backdrop-blur-sm p-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 shadow-inner" 
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-gray-600">
                                    <h4 className="text-lg font-semibold text-white flex items-center mb-4">
                                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mr-3 shadow-lg"><span className="text-white font-bold text-sm">3</span></div>
                                        Fatura Bilgileri
                                    </h4>
                                    {invoiceType === 'corporate' && (
                                        <div className="space-y-4 bg-blue-900/30 backdrop-blur-sm p-6 rounded-xl border border-blue-700/50">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-300">Firma Unvanı *</label>
                                                <input 
                                                    type="text" 
                                                    name="companyTitle" 
                                                    value={formData.companyTitle} 
                                                    onChange={handleFormChange} 
                                                    placeholder="ABC Şirketi Ltd. Şti." 
                                                    className="block w-full rounded-xl border-2 border-gray-600 bg-gray-800/80 backdrop-blur-sm p-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 shadow-inner" 
                                                    required 
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-gray-300">Vergi Dairesi *</label>
                                                    <input 
                                                        type="text" 
                                                        name="taxOffice" 
                                                        value={formData.taxOffice} 
                                                        onChange={handleFormChange} 
                                                        placeholder="Kadıköy Vergi Dairesi" 
                                                        className="block w-full rounded-xl border-2 border-gray-600 bg-gray-800/80 backdrop-blur-sm p-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 shadow-inner" 
                                                        required 
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-gray-300">Vergi Numarası *</label>
                                                    <input 
                                                        type="text" 
                                                        name="taxNumber" 
                                                        value={formData.taxNumber} 
                                                        onChange={handleFormChange} 
                                                        placeholder="1234567890" 
                                                        className="block w-full rounded-xl border-2 border-gray-600 bg-gray-800/80 backdrop-blur-sm p-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 shadow-inner" 
                                                        required 
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {invoiceType === 'individual' && (
                                        <div className="bg-green-900/30 backdrop-blur-sm p-6 rounded-xl border border-green-700/50">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-300">T.C. Kimlik Numarası *</label>
                                                <input 
                                                    type="text" 
                                                    name="tckn" 
                                                    value={formData.tckn} 
                                                    onChange={handleFormChange} 
                                                    placeholder="12345678901" 
                                                    className="block w-full rounded-xl border-2 border-gray-600 bg-gray-800/80 backdrop-blur-sm p-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-300 shadow-inner" 
                                                    required 
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Sağ Taraf: Sipariş Özeti */}
                        <div className="w-full xl:w-2/5 bg-gray-700/30 backdrop-blur-sm p-8 lg:p-12 flex flex-col border-l border-gray-600">
                            <div className="bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-600">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-3 shadow-lg"><span className="text-white font-bold text-sm">✓</span></div>
                                    Sipariş Özeti
                                </h3>
                                <div className="space-y-4">
                                    {items.map(item => (
                                        <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-700/50 backdrop-blur-sm rounded-xl border border-gray-600">
                                            <div className="relative">
                                                <img src={item.imageUrl} alt={item.name} className="w-20 h-20 rounded-xl object-cover shadow-lg ring-2 ring-gray-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-white text-lg leading-tight">{item.name}</p>
                                                <p className="text-blue-400 font-semibold text-lg">{(item.price).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex-grow"></div>
                            <div className="mt-8 bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-600">
                                <div className="space-y-4">
                                    <div className="flex justify-between text-gray-300 text-lg"><span>Ara Toplam</span><span className="font-medium text-white">{subTotalWithoutTax.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span></div>
                                    <div className="flex justify-between text-gray-300 text-lg"><span>KDV (%20)</span><span className="font-medium text-white">{taxAmount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span></div>
                                    <div className="border-t-2 border-gray-600 pt-4">
                                        <div className="flex justify-between text-2xl font-bold text-white"><span>Toplam</span><span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">{total.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span></div>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <BuyButton
                                        products={items}
                                        formData={formData as BuyerFormData}
                                    />
                                </div>
                                <div className="mt-4 text-center">
                                    <p className="text-xs text-gray-400 flex items-center justify-center"><LockIcon />Güvenli Ödeme - SSL Sertifikası ile Korunmaktadır</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}