
export const redirectCheckout = (product_id: number) => {
    window.location.href = `/checkout?buyNow=true&product_id=${product_id}`;
  }

export const DirectBuyButton = ({ productId }: { productId: number }) => {
  return (
    <button 
      onClick={() => redirectCheckout(productId)} 
      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
    >
      Direkt Satın Al
    </button>
  );
};