// app/page.tsx

'use client';

import { useRouter } from 'next/navigation';
// Ürünlerimizi ve tip tanımını yeni dosyadan import ediyoruz.
import { products, type Product } from '@/lib/products'; 

const BuyButton = ({ onClick, buttonText, className }: { onClick: () => void; buttonText: string; className: string; }) => {
  return <button onClick={onClick} className={className}>{buttonText}</button>;
};

export default function Home() {
  const router = useRouter();

  const handleBuyNow = (productId: number) => {
    // Kullanıcıyı sadece ürün ID'si ile checkout sayfasına yönlendir.
    router.push(`/checkout?id=${productId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Online Mağaza</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 lg:col-span-3">Ürünler</h2>
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col">
              <div className="flex-grow">
                <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold text-blue-600">
                    {product.price.toLocaleString('tr-TR')} ₺
                  </span>
                </div>
              </div>
              <BuyButton
                onClick={() => handleBuyNow(product.id)}
                buttonText="Satın Al"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm mt-auto"
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}