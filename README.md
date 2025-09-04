# Minimal Iyzico Payment Component

En basit ve minimal Iyzico ödeme sistemi implementasyonu.

## 🎯 Amaç

Sanal ürün satışı için en minimal ödeme yapısı. Sadece zorunlu alanlar ve token işlemleri.

## 📁 Dosya Yapısı

```
src/
├── components/
│   └── BuyButton.tsx          # UI Component
├── hooks/
│   └── usePayment.ts          # Payment Hook  
├── lib/
│   └── iyzico.ts             # Iyzico Config
└── app/
    ├── api/payment/
    │   └── route.ts          # API Route
    └── page.tsx              # Demo Page
```

## 🚀 Kullanım

```tsx
import BuyButton from '@/components/BuyButton';

const product = {
  id: 1,
  name: 'Sanal Ürün',
  price: 10000, // 100 TL (kuruş cinsinden)
  category: 'Digital',
  description: 'Sanal ürün açıklaması'
};

<BuyButton
  product={product}
  buttonText="Satın Al"
  onSuccess={(result) => {
    console.log('Ödeme başarılı:', result);
  }}
  onError={(error) => {
    console.error('Ödeme hatası:', error);
  }}
/>
```

## ⚙️ Kurulum

1. Environment variables ekleyin:
```env
IYZICO_API_KEY=your_api_key
IYZICO_SECRET_KEY=your_secret_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

2. Component'i projenize kopyalayın
3. Hook'u kopyalayın
4. API route'u kopyalayın
5. Iyzico config'i kopyalayın

## 🔧 Özellikler

- ✅ **Minimal**: Sadece gerekli kod
- ✅ **Tek Ürün**: Basit satın alma
- ✅ **Demo Data**: Otomatik müşteri bilgileri
- ✅ **TypeScript**: Tip güvenliği
- ✅ **Loading State**: Kullanıcı geri bildirimi
- ✅ **Error Handling**: Hata yönetimi

## 🎨 Component API

```tsx
interface BuyButtonProps {
  product: Product;           // Zorunlu - Ürün bilgileri
  buttonText?: string;        // Opsiyonel - Buton metni
  className?: string;         // Opsiyonel - CSS sınıfları
  onSuccess?: (result) => void; // Opsiyonel - Başarı callback
  onError?: (error) => void;    // Opsiyonel - Hata callback
}
```

## 📊 Product Interface

```tsx
interface Product {
  id: number;
  name: string;
  price: number;        // Kuruş cinsinden (100 TL = 10000)
  category: string;
  description: string;
}
```

## 🔒 Güvenlik

- Minimal güvenlik (sadece token)
- Demo müşteri bilgileri
- Validasyon yok
- Sadece zorunlu alanlar

## 🎯 Hedef Kullanım

Bu yapı **sanal ürün satışı** için tasarlandı:
- Digital product satışı
- Subscription/abonelik
- License/lisans satışı
- Online course/kurs

## ⚠️ Notlar

- Fiyatlar kuruş cinsinden girilmeli
- Production'da güvenlik önlemleri ekleyin
- Müşteri bilgileri doğrulaması ekleyin
- Error handling'i geliştirin

## 🚀 Avantajlar

1. **Çok Basit**: Minimum kod
2. **Hızlı Setup**: 5 dakikada hazır
3. **Modüler**: Kolayca genişletilebilir
4. **TypeScript**: Tip güvenliği
5. **Modern**: React hooks kullanımı

Bu component ile hızlıca sanal ürün satışına başlayabilirsiniz! 🎉