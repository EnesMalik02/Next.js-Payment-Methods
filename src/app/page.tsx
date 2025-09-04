'use client';

import Link from 'next/link';
import { useState } from 'react';
import IyzicoPayment from '@/components/IyzicoPayment';

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

const products: Product[] = [
  {
    id: 1,
    name: 'iPhone 15 Pro',
    price: 45999,
    category: 'Elektronik',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop',
    description: 'Apple iPhone 15 Pro 128GB Doğal Titanyum'
  },
  {
    id: 2,
    name: 'Samsung Galaxy S24',
    price: 32999,
    category: 'Elektronik',
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300&h=300&fit=crop',
    description: 'Samsung Galaxy S24 256GB Siyah'
  },
  {
    id: 3,
    name: 'MacBook Air M3',
    price: 54999,
    category: 'Bilgisayar',
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300&h=300&fit=crop',
    description: 'Apple MacBook Air 13" M3 Çip 8GB RAM 256GB SSD'
  },
  {
    id: 4,
    name: 'Sony WH-1000XM5',
    price: 8999,
    category: 'Ses',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop',
    description: 'Sony WH-1000XM5 Kablosuz Gürültü Önleyici Kulaklık'
  },
  {
    id: 5,
    name: 'iPad Pro 12.9"',
    price: 42999,
    category: 'Tablet',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop',
    description: 'Apple iPad Pro 12.9" M2 Çip 128GB Wi-Fi'
  },
  {
    id: 6,
    name: 'Nike Air Max 270',
    price: 3499,
    category: 'Ayakkabı',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
    description: 'Nike Air Max 270 Erkek Spor Ayakkabı'
  },
  {
    id: 7,
    name: 'Canon EOS R6',
    price: 89999,
    category: 'Fotoğraf',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&h=300&fit=crop',
    description: 'Canon EOS R6 Mark II Aynasız Fotoğraf Makinesi'
  },
  {
    id: 8,
    name: 'PlayStation 5',
    price: 19999,
    category: 'Oyun',
    image: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=300&h=300&fit=crop',
    description: 'Sony PlayStation 5 Oyun Konsolu'
  },
  {
    id: 9,
    name: 'Apple Watch Series 9',
    price: 12999,
    category: 'Giyilebilir',
    image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=300&h=300&fit=crop',
    description: 'Apple Watch Series 9 GPS 45mm'
  },
  {
    id: 10,
    name: 'Dyson V15 Detect',
    price: 15999,
    category: 'Ev Aletleri',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop',
    description: 'Dyson V15 Detect Kablosuz Süpürge'
  }
];

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Online Mağaza</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M7 19a2 2 0 11-4 0 2 2 0 014 0zM17 19a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Sepet ({getTotalItems()})</span>
                </button>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Ana İçerik */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Ürünler */}
          <div className="lg:col-span-3">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Öne Çıkan Ürünler</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-blue-600">
                        {product.price.toLocaleString('tr-TR')} ₺
                      </span>
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Sepete Ekle
                      </button>
                    </div>
                    <IyzicoPayment
                      type="single"
                      product={product}
                      buttonText="Satın Al"
                      className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                      onSuccess={(result) => {
                        console.log('Ödeme başarılı:', result);
                      }}
                      onError={(error) => {
                        console.error('Ödeme hatası:', error);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sepet Özeti */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sepet Özeti</h3>
              
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Sepetiniz boş</p>
              ) : (
                <>
                  <div className="space-y-3 mb-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-gray-500">{item.quantity} adet</p>
                        </div>
                        <p className="font-semibold">
                          {(item.price * item.quantity).toLocaleString('tr-TR')} ₺
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Toplam:</span>
                      <span className="text-blue-600">
                        {getTotalPrice().toLocaleString('tr-TR')} ₺
                      </span>
                    </div>
                  </div>
                </>
              )}
              
              {cart.length > 0 ? (
                <IyzicoPayment
                  type="cart"
                  cartItems={cart}
                  buttonText="Sepeti Öde"
                  className="w-full mt-6 py-3 rounded-lg font-semibold transition-colors bg-blue-600 text-white hover:bg-blue-700"
                  onSuccess={(result) => {
                    console.log('Sepet ödemesi başarılı:', result);
                    // Sepeti temizle
                    setCart([]);
                    localStorage.removeItem('cart');
                  }}
                  onError={(error) => {
                    console.error('Sepet ödemesi hatası:', error);
                  }}
                />
              ) : (
                <button
                  disabled
                  className="w-full mt-6 py-3 rounded-lg font-semibold transition-colors bg-gray-300 text-gray-500 cursor-not-allowed"
                >
                  Ödemeye Geç
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}