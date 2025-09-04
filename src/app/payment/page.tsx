'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface BuyerInfo {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
}

export default function PaymentPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [buyerInfo, setBuyerInfo] = useState<BuyerInfo>({
    id: `BY${Date.now()}`,
    name: '',
    surname: '',
    email: '',
    phone: '',
    address: '',
    city: 'İstanbul',
    zipCode: '34000'
  });

  useEffect(() => {
    // localStorage'dan sepet verilerini al
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    } else {
      // Sepet boşsa ana sayfaya yönlendir
      router.push('/');
    }

    // Sayfa yüklendiğinde eski token'ları temizle
    console.log('Ödeme sayfası yüklendi, token temizliği yapılıyor...');
    
    // Browser cache'ini temizle
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          if (name.includes('iyzico') || name.includes('payment')) {
            caches.delete(name);
          }
        });
      });
    }
  }, [router]);

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBuyerInfo({
      ...buyerInfo,
      [e.target.name]: e.target.value
    });
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      alert('Sepetiniz boş!');
      return;
    }

    // Form validasyonu
    if (!buyerInfo.name || !buyerInfo.surname || !buyerInfo.email || !buyerInfo.phone) {
      alert('Lütfen tüm zorunlu alanları doldurun!');
      return;
    }

    // Email validasyonu
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(buyerInfo.email)) {
      alert('Lütfen geçerli bir e-posta adresi girin!');
      return;
    }

    // Telefon validasyonu (basit)
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(buyerInfo.phone)) {
      alert('Lütfen geçerli bir telefon numarası girin!');
      return;
    }

    setLoading(true);

    try {
      console.log('Yeni ödeme talebi başlatılıyor...');
      
      // Her ödeme işleminde yeni bir buyer ID oluştur
      const updatedBuyerInfo = {
        ...buyerInfo,
        id: `BY${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
      };

      const response = await fetch('/api/iyzico/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache', // Cache'i engelle
        },
        body: JSON.stringify({
          cartItems: cart,
          buyerInfo: updatedBuyerInfo,
          timestamp: Date.now() // Her istek için benzersiz timestamp
        })
      });

      const result = await response.json();
      console.log('Ödeme API yanıtı:', result);

      if (result.status === 'success') {
        console.log('Ödeme formu başarıyla oluşturuldu, yönlendiriliyor...');
        
        // Önce paymentPageUrl'i dene
        if (result.paymentPageUrl) {
          console.log('PaymentPageUrl ile yönlendiriliyor:', result.paymentPageUrl);
          window.location.href = result.paymentPageUrl;
        } else if (result.checkoutFormContent) {
          console.log('CheckoutFormContent ile yeni pencere açılıyor');
          // Checkout form content'i mevcut sayfada göster
          document.body.innerHTML = result.checkoutFormContent;
        } else {
          throw new Error('Ödeme sayfası URL\'si veya içeriği bulunamadı');
        }
      } else {
        console.error('Ödeme API hatası:', result);
        alert('Ödeme başlatılamadı: ' + (result.errorMessage || 'Bilinmeyen hata'));
      }
    } catch (error) {
      console.error('Ödeme hatası:', error);
      alert('Ödeme sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M7 19a2 2 0 11-4 0 2 2 0 014 0zM17 19a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Sepetiniz Boş</h1>
          <p className="text-gray-600 mb-6">Ödeme yapabilmek için önce ürün eklemelisiniz.</p>
          <Link href="/">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
              Alışverişe Devam Et
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ödeme</h1>
          <p className="text-gray-600">Siparişinizi tamamlamak için bilgilerinizi girin</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Ödeme Formu */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Müşteri Bilgileri</h2>
              
              <form onSubmit={handlePayment} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Ad *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={buyerInfo.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Adınızı girin"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="surname" className="block text-sm font-medium text-gray-700 mb-2">
                      Soyad *
                    </label>
                    <input
                      type="text"
                      id="surname"
                      name="surname"
                      required
                      value={buyerInfo.surname}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Soyadınızı girin"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={buyerInfo.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="ornek@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={buyerInfo.phone}
                    onChange={handleInputChange}
                    placeholder="+90 555 123 45 67"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Adres
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    value={buyerInfo.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Adres bilginizi girin"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                      Şehir
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={buyerInfo.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Şehir"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                      Posta Kodu
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={buyerInfo.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="34000"
                    />
                  </div>
                </div>

                {/* Ödeme Butonu */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center items-center space-x-2 py-4 px-6 rounded-lg font-bold text-lg transition-colors ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                  } text-white shadow-lg`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>İşleniyor...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <span>Iyzico ile Ödemeye Geç</span>
                    </>
                  )}
                </button>
              </form>

              {/* Geri Dön Linki */}
              <div className="text-center mt-6">
                <Link href="/">
                  <button className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 hover:underline transition-colors">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Alışverişe Geri Dön
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Sipariş Özeti */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Sipariş Özeti</h2>
              
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 py-2 border-b border-gray-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.quantity} adet</p>
                    </div>
                    <p className="font-semibold text-sm">
                      {(item.price * item.quantity).toLocaleString('tr-TR')} ₺
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Toplam:</span>
                  <span className="text-blue-600">
                    {getTotalPrice().toLocaleString('tr-TR')} ₺
                  </span>
                </div>
                <p className="text-xs text-gray-500 text-center">
                  * Güvenli ödeme Iyzico ile sağlanmaktadır
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
