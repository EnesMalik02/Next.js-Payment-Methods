# Next.js Iyzico Ödeme Entegrasyonu

Bu proje, Next.js 15 ve Iyzico ödeme sistemi entegrasyonunu içeren modern bir e-ticaret uygulamasıdır. GitHub'daki [iyzipay-node](https://github.com/iyzico/iyzipay-node) reposundan yararlanılarak oluşturulmuştur.

## 🚀 Özellikler

- ✅ Modern Next.js 15 ve React 19 kullanımı
- ✅ Iyzico Checkout Form entegrasyonu
- ✅ TypeScript desteği
- ✅ Tailwind CSS ile responsive tasarım
- ✅ Sepet yönetimi (localStorage)
- ✅ Ödeme durumu takibi
- ✅ Test kartları ile kolay test etme
- ✅ Güvenli API route'ları
- ✅ Hata yönetimi ve kullanıcı bildirimleri

## 📦 Kurulum

### 1. Depoyu klonlayın
```bash
git clone <repository-url>
cd Next.js-Payment-Ways
```

### 2. Bağımlılıkları yükleyin
```bash
npm install
```

### 3. Environment variables ayarlayın
`env.example` dosyasını kopyalayın ve `.env.local` olarak yeniden adlandırın:
```bash
cp env.example .env.local
```

`.env.local` dosyasını düzenleyin ve Iyzico API anahtarlarınızı ekleyin:
```env
IYZICO_API_KEY=your_iyzico_api_key_here
IYZICO_SECRET_KEY=your_iyzico_secret_key_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NODE_ENV=development
```

### 4. Uygulamayı başlatın
```bash
npm run dev
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışacaktır.

## 🔧 Iyzico API Anahtarları

### Test Ortamı (Sandbox)
1. [Iyzico Developer](https://dev.iyzipay.com/) hesabınızda oturum açın
2. **Ayarlar > API Anahtarları** bölümünden test anahtarlarınızı alın
3. `.env.local` dosyasına ekleyin

### Canlı Ortam (Production)
1. [Iyzico Merchant Panel](https://merchant.iyzipay.com/) hesabınızda oturum açın
2. Canlı API anahtarlarınızı alın
3. `NODE_ENV=production` olarak ayarlayın

## 💳 Test Kartları

Uygulamayı test etmek için aşağıdaki test kartlarını kullanabilirsiniz:

### Başarılı Ödeme Kartları
| Kart Numarası | Banka | Kart Türü |
|---------------|-------|-----------|
| 5528790000000008 | Halkbank | Master Card (Credit) |
| 4766620000000001 | Denizbank | Visa (Debit) |
| 5890040000000016 | Akbank | Master Card (Debit) |
| 4603450000000000 | Denizbank | Visa (Credit) |

### Hata Test Kartları
| Kart Numarası | Hata Türü |
|---------------|-----------|
| 4111111111111129 | Yetersiz bakiye |
| 4129111111111111 | İşlem reddedildi |
| 4128111111111112 | Geçersiz işlem |
| 4127111111111113 | Kayıp kart |

**Not:** Tüm test kartları için CVV: `123`, Son Kullanma Tarihi: `12/2030` kullanabilirsiniz.

## 📁 Proje Yapısı

```
src/
├── app/
│   ├── api/
│   │   └── iyzico/
│   │       ├── callback/          # Ödeme callback endpoint'i
│   │       └── payment/
│   │           ├── create/         # Ödeme oluşturma API
│   │           └── retrieve/       # Ödeme sorgulama API
│   ├── order-result/               # Ödeme sonuç sayfası
│   ├── payment/                    # Ödeme formu sayfası
│   ├── globals.css                 # Global CSS
│   ├── layout.tsx                  # Ana layout
│   └── page.tsx                    # Ana sayfa (ürün listesi)
├── lib/
│   └── iyzico.ts                   # Iyzico konfigürasyon ve yardımcı fonksiyonlar
```

## 🔄 Ödeme Akışı

1. **Ürün Seçimi**: Kullanıcı ürünleri sepete ekler
2. **Ödeme Sayfası**: Müşteri bilgilerini doldurur
3. **Iyzico Entegrasyonu**: API üzerinden Iyzico'ya ödeme talebi gönderilir
4. **Ödeme Formu**: Kullanıcı Iyzico'nun güvenli ödeme sayfasına yönlendirilir
5. **Callback**: Ödeme sonucu callback endpoint'ine döner
6. **Sonuç Sayfası**: Kullanıcıya ödeme durumu gösterilir

## 🛠️ API Endpoints

### POST /api/iyzico/payment/create
Yeni ödeme oluşturur ve Iyzico checkout form döner.

**Request Body:**
```json
{
  "cartItems": [
    {
      "id": 1,
      "name": "Ürün Adı",
      "price": 10000,
      "quantity": 1,
      "category": "Elektronik"
    }
  ],
  "buyerInfo": {
    "name": "John",
    "surname": "Doe",
    "email": "john@example.com",
    "phone": "+90 555 123 45 67",
    "address": "Test Adres",
    "city": "İstanbul",
    "zipCode": "34000"
  }
}
```

### POST /api/iyzico/callback
Iyzico'dan gelen ödeme sonucu callback'ini işler.

### POST /api/iyzico/payment/retrieve
Ödeme durumunu sorgular.

## 🔒 Güvenlik

- API anahtarları sunucu tarafında saklanır
- Ödeme işlemleri Iyzico'nun güvenli altyapısı üzerinden gerçekleşir
- Hassas veriler client-side'da saklanmaz
- HTTPS kullanımı önerilir (production'da zorunlu)

## 🚦 Ortam Ayarları

### Development (Test Ortamı)
- Iyzico Sandbox API kullanılır
- Test kartları ile ödeme yapılabilir
- Debug logları aktiftir

### Production (Canlı Ortam)
- Iyzico Production API kullanılır
- Gerçek kartlarla ödeme alınır
- `NODE_ENV=production` olarak ayarlanmalıdır

## 🛠️ Test Komutları

```bash
# Iyzico konfigürasyonunu test et
npm run test:iyzico

# API bağlantısını test et (server çalışırken)
npm run test:connection

# Development server'ı başlat
npm run dev
```

## 🔧 Sorun Giderme

### "Geçersiz token" Hatası
Bu hata genellikle aşağıdaki durumlarda oluşur:
- Aynı token birden fazla kullanılmaya çalışıldığında
- Environment variables doğru ayarlanmadığında
- Callback URL'i yanlış yapılandırıldığında

**Çözüm:** Her ödeme işleminde yeni token oluşturulur. Eğer hata devam ederse:
1. `.env.local` dosyasını kontrol edin
2. `npm run test:connection` ile bağlantıyı test edin
3. Browser cache'ini temizleyin

### Debug API
Sistem durumunu kontrol etmek için: `http://localhost:3000/api/iyzico/debug`

## 📝 Notlar

- Fiyatlar kuruş cinsinden saklanır (100 = 1 TL)
- Callback URL'i production'da güncellenmelidir
- Iyzico merchant panel'den webhook ayarları yapılabilir
- Test ortamında gerçek para transferi olmaz
- Her ödeme işleminde benzersiz token oluşturulur

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Commit yapın (`git commit -m 'Add some AmazingFeature'`)
4. Push yapın (`git push origin feature/AmazingFeature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🔗 Faydalı Bağlantılar

- [Iyzico Developer Dokümantasyonu](https://dev.iyzipay.com/tr)
- [iyzipay-node GitHub Repository](https://github.com/iyzico/iyzipay-node)
- [Next.js Dokümantasyonu](https://nextjs.org/docs)
- [Tailwind CSS Dokümantasyonu](https://tailwindcss.com/docs)