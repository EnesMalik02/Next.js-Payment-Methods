'use client';

import { useState, useEffect } from 'react';
import { products, Product } from '@/lib/products';
// 1. YENİ COMPONENT'İ IMPORT EDELİM
import { AddToCartButton } from '@/components/AddToCartButton';

interface CartItem extends Product {
  quantity: number;
}

// 2. HEADER CART COMPONENT'İNİ GÜNCELLEYELİM
// Artık sepetten ürün çıkarma fonksiyonunu da prop olarak alacak
const HeaderCart = ({ cartItems, onRemoveFromCart }: { cartItems: CartItem[], onRemoveFromCart: (productId: number) => void }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="relative">
      <button onClick={() => setIsCartOpen(!isCartOpen)} className="relative">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </button>

      {isCartOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-10 p-4">
          {cartItems.length === 0 ? (
            <p className="text-gray-700">Sepetiniz boş.</p>
          ) : (
            <>
              <h4 className="text-lg font-semibold mb-2">Sepetim</h4>
              <ul>
                {cartItems.map(item => (
                  <li key={item.id} className="flex justify-between items-center border-b py-2">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.quantity} x {item.price.toLocaleString('tr-TR')} ₺</p>
                    </div>
                    {/* Ürünü sepetten çıkarmak için buton */}
                    <button onClick={() => onRemoveFromCart(item.id)} className="text-red-500 hover:text-red-700 font-bold">
                      X
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-2 border-t">
                <div className="flex justify-between font-bold text-lg">
                  <span>Toplam:</span>
                  <span>{totalPrice.toLocaleString('tr-TR')} ₺</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export const redirectCheckout = (product_id: number) => {
  window.location.href = `/checkout?product_id=${product_id}`;
}

export default function Home() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem('shoppingCart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    // Sepet boşaldığında localStorage'dan da silelim.
    if (cartItems.length === 0) {
      localStorage.removeItem('shoppingCart');
    } else {
      localStorage.setItem('shoppingCart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = (productId: number) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === productId);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        const productToAdd = products.find(p => p.id === productId);
        if (productToAdd) {
          return [...prevItems, { ...productToAdd, quantity: 1 }];
        }
      }
      return prevItems;
    });
  };

  // 3. SEPETTEN ÇIKARMA FONKSİYONUNU EKLEYELİM
  const removeFromCart = (productId: number) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === productId);

      // Ürün bulunamazsa bir şey yapma
      if (!existingItem) return prevItems;
      
      // Ürünün adedi 1'den fazlaysa, sadece miktarını azalt
      if (existingItem.quantity > 1) {
        return prevItems.map(item => 
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
        // Ürünün adedi 1 ise, ürünü sepetten tamamen kaldır
        return prevItems.filter(item => item.id !== productId);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Online Mağaza</h1>
            <div className="flex items-center space-x-4">
              {/* 4. YENİ FONKSİYONU HEADER'A PROP OLARAK GEÇELİM */}
              <HeaderCart cartItems={cartItems} onRemoveFromCart={removeFromCart} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 md:col-span-2 lg:col-span-3">Ürünler</h2>
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold text-blue-600">
                    {product.price.toLocaleString('tr-TR')} ₺
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-auto pt-4">
                {/* 5. ESKİ BUTON YERİNE YENİ COMPONENT'İ KULLANALIM */}
                <AddToCartButton productId={product.id} onAddToCart={addToCart} />
                <button 
                  onClick={() => redirectCheckout(product.id)} 
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Satın Al
                </button>
              </div>

            </div>
          ))}
        </div>
      </main>
    </div>
  );
}