// app/checkout/page.tsx

"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
// getProductById fonksiyonuna hala "Satın Al" senaryosu için ihtiyacımız var.
import { getProductById, Product } from '@/lib/products';
import BuyButton from '@/components/BuyButton';

// 1. SEPET ÜRÜNÜ TİPİ: Sepetteki ürünlerin miktarını da tutmamız gerekiyor.
interface CartItem extends Product {
    quantity: number;
}

export interface BuyerFormData {
    name: string;
    surname: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    zipCode: string;
    tckn: string;
    companyTitle: string;
    taxOffice: string;
    taxNumber: string;
}

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1 text-green-600" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 2a5 5 0 00-5 5v3a5 5 0 00-5 5v2a5 5 0 005 5h10a5 5 0 005-5v-2a5 5 0 00-5-5V7a5 5 0 00-5-5zm-3 7a3 3 0 006 0V7a3 3 0 10-6 0v2z" clipRule="evenodd" />
    </svg>
);

export default function CheckoutPage() {
    const searchParams = useSearchParams();
    
    // 2. STATE DEĞİŞİKLİĞİ: Tek bir ürün yerine, bir ürün dizisi (sepet) tutacağız.
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true); // Veri yüklenirken kullanıcıyı bilgilendirmek için loading state'i

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
        setFormData((prev: BuyerFormData) => ({ ...prev, [name]: value }));    };

    // 3. useEffect MANTIĞINI GÜNCELLEDİK
    useEffect(() => {
        try {
            // "Satın Al" butonu ile mi gelindi?
            if (searchParams.get('buyNow') === 'true') {
                const productId = searchParams.get('product_id');
                if (productId) {
                    const foundProduct = getProductById(Number(productId));
                    if (foundProduct) {
                        // State'i her zaman bir dizi olarak tutuyoruz.
                        setItems([{ ...foundProduct, quantity: 1 }]);
                    }
                }
            } else {
                // "buyNow" false veya yoksa, sepetten geliniyordur. localStorage'ı kullan.
                const storedCart = localStorage.getItem('shoppingCart');
                if (storedCart) {
                    const cartItemsFromStorage: CartItem[] = JSON.parse(storedCart);
                    setItems(cartItemsFromStorage);
                }
            }
        } catch (error) {
            console.error("Ödeme verileri işlenirken hata oluştu:", error);
            // Hata durumunda sepeti boşaltabiliriz.
            setItems([]);
        } finally {
            // İşlem ne olursa olsun, yüklenmeyi durdur.
            setIsLoading(false);
        }
    }, [searchParams]);

    // Yüklenme ekranı
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-700 text-lg font-medium">Sipariş bilgileri yükleniyor...</p>
                </div>
            </div>
        );
    }

    // Sepet boşsa gösterilecek ekran
    if (items.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center p-8 bg-white rounded-xl shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800">Sepetiniz Boş</h2>
                    <p className="text-gray-600 mt-2">Ödeme yapmak için sepetinizde en az bir ürün bulunmalıdır.</p>
                    <a href="/" className="mt-6 inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                        Alışverişe Devam Et
                    </a>
                </div>
            </div>
        );
    }

    // 4. HESAPLAMALARI GÜNCELLEDİK (Sepetteki tüm ürünler için)
    const subTotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const displayTax = subTotal * 0.20;
    const displayTotal = subTotal + displayTax;

    return (
        <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen p-4 sm:p-8">
            <div className="w-full max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Ödeme Sayfası</h1>
                    <p className="text-gray-600 text-lg">Siparişinizi tamamlamak için bilgilerinizi doldurun</p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    <div className="flex flex-col xl:flex-row">
                        {/* Sol Taraf: Form (Değişiklik yok) */}
                        <div className="w-full xl:w-3/5 p-8 lg:p-12">
                            {/* ... Form içeriğiniz burada ... */}
                        </div>

                        {/* Sağ Taraf: Sipariş Özeti */}
                        <div className="w-full xl:w-2/5 bg-gray-50 p-8 lg:p-12 flex flex-col">
                            <div className="bg-white rounded-2xl p-6 shadow-sm border">
                                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                        <span className="text-green-600 font-bold text-sm">✓</span>
                                    </div>
                                    Sipariş Özeti
                                </h3>
                                
                                {/* 5. SİPARİŞ ÖZETİ'Nİ DİNAMİK HALE GETİRDİK (.map kullanarak) */}
                                <div className="space-y-4">
                                    {items.map(item => (
                                        <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                                            <div className="relative">
                                                <img src={item.imageUrl} alt={item.name} className="w-20 h-20 rounded-xl object-cover shadow-sm" />
                                                <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                                                    {item.quantity}
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-gray-900 text-lg leading-tight">{item.name}</p>
                                                <p className="text-blue-600 font-semibold text-lg">
                                                    {(item.price * item.quantity).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex-grow"></div>

                            {/* Fiyat Detayları ve Satın Al */}
                            <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border">
                                <div className="space-y-4">
                                    <div className="flex justify-between text-gray-600 text-lg">
                                        <span>Ara Toplam</span>
                                        <span className="font-medium">
                                            {subTotal.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
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
                                    {/* 6. BuyButton'A GÖNDERİLEN PROP'U GÜNCELLEDİK */}
                                    {/* Artık tek bir ürün değil, tüm sepeti gönderiyoruz */}
                                    <BuyButton
                                        products={items} // 'product' yerine 'items'
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