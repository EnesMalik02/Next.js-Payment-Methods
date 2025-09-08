'use client';

import BuyButton from '@/components/BuyButton';
import type { Product } from '@/hooks/usePayment';

const products: Product[] = [
  {
    id: 1,
    name: 'iPhone 15 Pro',
    price: 45999,
    category: 'Elektronik',
    description: 'Apple iPhone 15 Pro 128GB Doğal Titanyum'
  },
  {
    id: 2,
    name: 'Samsung Galaxy S24',
    price: 32999,
    category: 'Elektronik',
    description: 'Samsung Galaxy S24 256GB Siyah'
  },
  {
    id: 3,
    name: 'MacBook Air M3',
    price: 54999,
    category: 'Bilgisayar',
    description: 'Apple MacBook Air 13" M3 Çip 8GB RAM 256GB SSD'
  }
];

export default function Home() {


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Online Mağaza</h1>
            <div className="flex items-center space-x-4">
            </div>
          </div>
        </div>
      </header>

      {/* Ana İçerik */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 lg:col-span-3">Ürünler</h2>
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{product.description}</p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold text-blue-600">
                  {product.price.toLocaleString('tr-TR')} ₺
                </span>
              </div>
              <BuyButton
                product={product}
                buttonText="Satın Al"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                onSuccess={(result) => {
                  console.log('Ödeme başarılı:', result);
                }}
                onError={(error) => {
                  console.error('Ödeme hatası:', error);
                  alert(error);
                }}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}