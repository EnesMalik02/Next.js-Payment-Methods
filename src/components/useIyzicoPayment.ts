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
  
  interface IyzicoPaymentConfig {
    product?: Product;
    cartItems?: CartItem[];
    buyerInfo?: BuyerInfo;
    onSuccess?: (result: any) => void;
    onError?: (error: string) => void;
  }
  
  export const handleDirectPayment = async (config: IyzicoPaymentConfig) => {
    try {
      console.log('Direkt ödeme başlatılıyor...');
      
      let cartItems: CartItem[];
      
      if (config.product) {
        // Tek ürün için cartItem oluştur
        cartItems = [{ ...config.product, quantity: 1 }];
      } else if (config.cartItems) {
        // Mevcut sepet öğelerini kullan
        cartItems = config.cartItems;
      } else {
        throw new Error('Ürün veya sepet bilgisi gerekli');
      }
  
      // Varsayılan buyer bilgileri (demo için)
      const buyerInfo: BuyerInfo = config.buyerInfo || {
        id: `BY${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        name: 'Demo',
        surname: 'Kullanıcı',
        email: 'demo@example.com',
        phone: '+905551234567',
        address: 'Demo Adres',
        city: 'İstanbul',
        zipCode: '34000'
      };
  
      const response = await fetch('/api/iyzico/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({
          cartItems,
          buyerInfo,
          timestamp: Date.now()
        })
      });
  
      const result = await response.json();
      console.log('Ödeme API yanıtı:', result);
  
      if (result.status === 'success') {
        console.log('Ödeme formu başarıyla oluşturuldu, yönlendiriliyor...');
        
        if (result.paymentPageUrl) {
          console.log('PaymentPageUrl ile yönlendiriliyor:', result.paymentPageUrl);
          window.location.href = result.paymentPageUrl;
        } else if (result.checkoutFormContent) {
          console.log('CheckoutFormContent ile yeni pencere açılıyor');
          document.body.innerHTML = result.checkoutFormContent;
        } else {
          throw new Error('Ödeme sayfası URL\'si veya içeriği bulunamadı');
        }
        
        config.onSuccess?.(result);
      } else {
        const errorMsg = 'Ödeme başlatılamadı: ' + (result.errorMessage || 'Bilinmeyen hata');
        console.error('Ödeme API hatası:', result);
        alert(errorMsg);
        config.onError?.(errorMsg);
      }
    } catch (error) {
      const errorMsg = 'Ödeme sırasında bir hata oluştu. Lütfen tekrar deneyin.';
      console.error('Ödeme hatası:', error);
      alert(errorMsg);
      config.onError?.(errorMsg);
    }
  };
  
  // Geriye uyumluluk için eski fonksiyon
  export const handlePayment = async (product: Product) => {
    return handleDirectPayment({ product });
  };