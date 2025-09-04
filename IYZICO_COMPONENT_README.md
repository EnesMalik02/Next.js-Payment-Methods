# IyzicoPayment Component Kullanım Kılavuzu

Bu proje, Iyzico ödeme sistemini kolayca entegre edebileceğiniz modern ve temiz mimariye sahip bir React component'i içerir.

## Özellikler

- ✅ **Temiz Mimari**: Ayrılmış katmanlar (UI, Business Logic, API)
- ✅ **Custom Hook**: useIyzicoPayment hook'u ile fonksiyonel işlemler
- ✅ **Service Layer**: PaymentService ile API çağrıları
- ✅ **Validasyonsuz API**: API'ler sadece isteği işler
- ✅ **UI Odaklı Component**: Sadece görsel işlemler
- ✅ **TypeScript Desteği**: Tam tip güvenliği
- ✅ **Tekrar Kullanılabilir**: Her projede kullanabilirsiniz

## Kurulum

1. `src/components/IyzicoPayment.tsx` - UI Component
2. `src/components/useIyzicoPayment.ts` - Custom Hook
3. `src/services/paymentService.ts` - API Service
4. API route'larınızı kopyalayın

## Kullanım Örnekleri

### 1. Tek Ürün Ödemesi (Satın Al Butonu)

```tsx
import IyzicoPayment from '@/components/IyzicoPayment';

const product = {
  id: 1,
  name: 'iPhone 15 Pro',
  price: 45999, // Kuruş cinsinden
  category: 'Elektronik',
  image: 'https://example.com/image.jpg',
  description: 'Apple iPhone 15 Pro 128GB'
};

<IyzicoPayment
  type="single"
  product={product}
  buttonText="Satın Al"
  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
  onSuccess={(result) => {
    console.log('Ödeme başarılı:', result);
  }}
  onError={(error) => {
    console.error('Ödeme hatası:', error);
  }}
/>
```

### 2. Sepet Ödemesi

```tsx
import IyzicoPayment from '@/components/IyzicoPayment';

const cartItems = [
  {
    id: 1,
    name: 'iPhone 15 Pro',
    price: 45999,
    quantity: 1,
    category: 'Elektronik',
    image: 'https://example.com/image1.jpg',
    description: 'Apple iPhone 15 Pro 128GB'
  },
  {
    id: 2,
    name: 'MacBook Air',
    price: 54999,
    quantity: 1,
    category: 'Bilgisayar',
    image: 'https://example.com/image2.jpg',
    description: 'Apple MacBook Air M3'
  }
];

<IyzicoPayment
  type="cart"
  cartItems={cartItems}
  buttonText="Sepeti Öde"
  className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
  onSuccess={(result) => {
    console.log('Sepet ödemesi başarılı:', result);
    // Sepeti temizle
    setCart([]);
  }}
  onError={(error) => {
    console.error('Sepet ödemesi hatası:', error);
  }}
/>
```

### 3. Müşteri Bilgileri ile Ödeme

```tsx
const buyerInfo = {
  id: 'BY123456',
  name: 'Ahmet',
  surname: 'Yılmaz',
  email: 'ahmet@example.com',
  phone: '+905551234567',
  address: 'Kadıköy, İstanbul',
  city: 'İstanbul',
  zipCode: '34710'
};

<IyzicoPayment
  type="single"
  product={product}
  buyerInfo={buyerInfo}
  requireBuyerInfo={true}
  buttonText="Güvenli Ödeme"
  onSuccess={(result) => {
    console.log('Ödeme başarılı:', result);
  }}
  onError={(error) => {
    console.error('Ödeme hatası:', error);
  }}
/>
```

## Component Props

| Prop | Tip | Zorunlu | Açıklama |
|------|-----|---------|----------|
| `type` | `'single' \| 'cart'` | ✅ | Ödeme türü |
| `product` | `Product` | Tek ürün için ✅ | Ürün bilgileri |
| `cartItems` | `CartItem[]` | Sepet için ✅ | Sepet öğeleri |
| `buyerInfo` | `Partial<BuyerInfo>` | ❌ | Müşteri bilgileri |
| `buttonText` | `string` | ❌ | Buton metni |
| `className` | `string` | ❌ | CSS sınıfları |
| `requireBuyerInfo` | `boolean` | ❌ | Müşteri bilgisi zorunluluğu |
| `loading` | `boolean` | ❌ | Dış loading kontrolü |
| `onSuccess` | `(result: any) => void` | ❌ | Başarı callback'i |
| `onError` | `(error: string) => void` | ❌ | Hata callback'i |
| `onLoading` | `(loading: boolean) => void` | ❌ | Loading callback'i |

## Type Definitions

```typescript
interface Product {
  id: number;
  name: string;
  price: number; // Kuruş cinsinden
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
```

## Mimari

### 1. UI Layer - IyzicoPayment.tsx
- Sadece görsel işlemler ve kullanıcı etkileşimi
- Hook'tan gelen fonksiyonları çağırır
- State yönetimi minimal

### 2. Business Logic Layer - useIyzicoPayment.ts
- Tüm iş mantığı burada
- Validasyon işlemleri
- Veri hazırlama
- State yönetimi

### 3. Service Layer - paymentService.ts
- API çağrıları
- HTTP işlemleri
- Error handling

### 4. API Layer - route.ts
- Sadece istekleri işler
- Validasyon YOK
- İş mantığı YOK

## Avantajlar

1. **Temiz Kod**: Ayrılmış sorumluluklar
2. **Kolay Test**: Her katman ayrı test edilebilir
3. **Bakım Kolaylığı**: Değişiklikler izole
4. **Tekrar Kullanılabilir**: Modüler yapı
5. **TypeScript Desteği**: Tam tip güvenliği
6. **Scalable**: Büyük projelere uygun

## Notlar

- Fiyatlar kuruş cinsinden girilmelidir (örn: 100 TL = 10000)
- Demo müşteri bilgileri otomatik olarak eklenir
- `requireBuyerInfo={true}` ile gerçek müşteri bilgisi zorunlu kılabilirsiniz
- Component otomatik olarak form validasyonu yapar

Bu component ile artık tüm projelerinizde kolayca Iyzico ödemesi entegre edebilirsiniz! 🚀
