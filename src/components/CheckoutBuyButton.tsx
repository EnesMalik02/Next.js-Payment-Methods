'use client';

import { usePayment } from '@/hooks/usePayment';
import { CartItem } from '@/hooks/usePayment';
import { BuyerFormData } from '@/app/checkout/page';

interface BuyButtonProps {
  products: CartItem[];
  formData: BuyerFormData;
  buttonText?: string;
  className?: string;
}

const BuyButton: React.FC<BuyButtonProps> = ({
  products,
  formData, 
  buttonText = 'Satın Al',
  className,
}) => {
  const { loading, buyProduct } = usePayment();

  const handleClick = () => {
    buyProduct(products , formData);
  };

  const defaultClassName = `
    flex items-center justify-center space-x-2 px-4 py-2 rounded-lg 
    font-semibold transition-colors text-sm
    ${loading 
      ? 'bg-gray-400 cursor-not-allowed text-white' 
      : 'bg-blue-600 hover:bg-blue-700 text-white'
    }
  `.trim();

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={className || defaultClassName}
      type="button"
    >
      {loading ? (
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
          <span>{buttonText}</span>
        </>
      )}
    </button>
  );
};

export default BuyButton;
export type { CartItem, BuyButtonProps };
