'use client';

// Bu component, hangi ürünün ekleneceğini (productId) ve
// tıklandığında hangi fonksiyonu çalıştıracağını (onAddToCart) prop olarak alır.
interface AddToCartButtonProps {
  productId: number;
  onAddToCart: (productId: number) => void;
}

export const AddToCartButton = ({ productId, onAddToCart }: AddToCartButtonProps) => {
  return (
    <button 
      onClick={() => onAddToCart(productId)} 
      className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
    >
      Sepete Ekle
    </button>
  );
};