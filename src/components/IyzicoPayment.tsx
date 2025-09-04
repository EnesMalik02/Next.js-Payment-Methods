'use client';

import { useState } from 'react';
import { handleDirectPayment } from '@/components/useIyzicoPayment';

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

interface IyzicoPaymentProps {
  // Ödeme türü - tek ürün veya sepet
  type: 'single' | 'cart';
  
  // Tek ürün ödemesi için
  product?: Product;
  
  // Sepet ödemesi için
  cartItems?: CartItem[];
  
  // Müşteri bilgileri (opsiyonel, varsayılan demo bilgileri kullanılır)
  buyerInfo?: Partial<BuyerInfo>;
  
  // Buton metni
  buttonText?: string;
  
  // Buton stili
  className?: string;
  
  // Callback fonksiyonları
  onSuccess?: (result: any) => void;
  onError?: (error: string) => void;
  onLoading?: (loading: boolean) => void;
  
  // Validasyon
  requireBuyerInfo?: boolean;
  
  // Loading state'i dışarıdan kontrol etmek için
  loading?: boolean;
}

const IyzicoPayment: React.FC<IyzicoPaymentProps> = ({
  type,
  product,
  cartItems,
  buyerInfo,
  buttonText,
  className,
  onSuccess,
  onError,
  onLoading,
  requireBuyerInfo = false,
  loading: externalLoading = false
}) => {
  const [internalLoading, setInternalLoading] = useState(false);
  
  const isLoading = externalLoading || internalLoading;

  const handlePayment = async () => {
    try {
      setInternalLoading(true);
      onLoading?.(true);

      // Validasyon
      if (type === 'single' && !product) {
        throw new Error('Tek ürün ödemesi için product gerekli');
      }
      
      if (type === 'cart' && (!cartItems || cartItems.length === 0)) {
        throw new Error('Sepet ödemesi için cartItems gerekli');
      }

      // Buyer bilgilerini hazırla
      const defaultBuyerInfo: BuyerInfo = {
        id: `BY${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        name: 'Demo',
        surname: 'Kullanıcı',
        email: 'demo@example.com',
        phone: '+905551234567',
        address: 'Demo Adres',
        city: 'İstanbul',
        zipCode: '34000',
        ...buyerInfo
      };

      // Eğer buyer bilgisi zorunluysa ve eksikse hata ver
      if (requireBuyerInfo) {
        const requiredFields = ['name', 'surname', 'email', 'phone'];
        const missingFields = requiredFields.filter(field => 
          !defaultBuyerInfo[field as keyof BuyerInfo] || 
          defaultBuyerInfo[field as keyof BuyerInfo] === 'Demo' ||
          defaultBuyerInfo[field as keyof BuyerInfo] === 'Kullanıcı' ||
          defaultBuyerInfo[field as keyof BuyerInfo] === 'demo@example.com'
        );
        
        if (missingFields.length > 0) {
          throw new Error(`Lütfen şu bilgileri doldurun: ${missingFields.join(', ')}`);
        }
      }

      // Ödeme işlemini başlat
      await handleDirectPayment({
        product: type === 'single' ? product : undefined,
        cartItems: type === 'cart' ? cartItems : undefined,
        buyerInfo: defaultBuyerInfo,
        onSuccess: (result) => {
          console.log('Ödeme başarılı:', result);
          onSuccess?.(result);
        },
        onError: (error) => {
          console.error('Ödeme hatası:', error);
          onError?.(error);
        }
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
      console.error('Ödeme hatası:', errorMessage);
      onError?.(errorMessage);
    } finally {
      setInternalLoading(false);
      onLoading?.(false);
    }
  };

  const getDefaultButtonText = () => {
    if (type === 'single') return 'Satın Al';
    if (type === 'cart') return 'Sepeti Öde';
    return 'Ödeme Yap';
  };

  const getDefaultClassName = () => {
    return `
      flex items-center justify-center space-x-2 px-4 py-2 rounded-lg 
      font-semibold transition-colors text-sm
      ${isLoading 
        ? 'bg-gray-400 cursor-not-allowed text-white' 
        : 'bg-blue-600 hover:bg-blue-700 text-white'
      }
    `.trim();
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className={className || getDefaultClassName()}
      type="button"
    >
      {isLoading ? (
        <>
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>İşleniyor...</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" 
            />
          </svg>
          <span>{buttonText || getDefaultButtonText()}</span>
        </>
      )}
    </button>
  );
};

export default IyzicoPayment;
export type { Product, CartItem, BuyerInfo, IyzicoPaymentProps };
