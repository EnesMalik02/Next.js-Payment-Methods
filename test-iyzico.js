// Iyzico entegrasyonunu test etmek için basit bir script

const testEnvironmentVariables = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const apiUrl = isProduction ? 'https://api.iyzipay.com' : 'https://sandbox-api.iyzipay.com';
  
  console.log('🔍 Environment Variables Kontrolü:');
  console.log('IYZICO_API_KEY:', process.env.IYZICO_API_KEY ? '✅ Mevcut' : '❌ Eksik');
  console.log('IYZICO_SECRET_KEY:', process.env.IYZICO_SECRET_KEY ? '✅ Mevcut' : '❌ Eksik');
  console.log('NEXT_PUBLIC_BASE_URL:', process.env.NEXT_PUBLIC_BASE_URL || '❌ Eksik');
  console.log('NODE_ENV:', process.env.NODE_ENV || 'development');
  console.log('ORTAM:', isProduction ? '⚠️  PRODUCTION (CANLI)' : '✅ SANDBOX (TEST)');
  console.log('API URL:', apiUrl);
  console.log('');
  
  if (!isProduction) {
    console.log('💡 Test ortamında çalışıyorsunuz. Sandbox API anahtarlarını kullanın!');
    console.log('   Sandbox anahtarları: https://dev.iyzipay.com');
  } else {
    console.log('⚠️  UYARI: Production ortamında çalışıyorsunuz!');
    console.log('   Canlı API anahtarlarını kullanın: https://merchant.iyzipay.com');
  }
  console.log('');
};

const testIyzicoConnection = async () => {
  try {
    console.log('🚀 Iyzico Bağlantısı Test Ediliyor...');
    
    const response = await fetch('http://localhost:3000/api/iyzico/debug?action=test-connection');
    const result = await response.json();
    
    if (result.status === 'success') {
      console.log('✅ Iyzico API bağlantısı başarılı!');
      console.log('Yanıt:', result.result?.status || 'OK');
    } else {
      console.log('❌ Iyzico API bağlantı hatası:', result.message);
      if (result.error) {
        console.log('Hata detayı:', result.error);
      }
    }
  } catch (error) {
    console.log('❌ Test sırasında hata:', error.message);
  }
  console.log('');
};

const testPaymentFlow = () => {
  console.log('💳 Test Kartları:');
  console.log('Başarılı ödeme için:');
  console.log('  - 5528790000000008 (Halkbank Master Card)');
  console.log('  - 4766620000000001 (Denizbank Visa Debit)');
  console.log('  - CVV: 123, Tarih: 12/2030');
  console.log('');
  console.log('Hata testi için:');
  console.log('  - 4111111111111129 (Yetersiz bakiye)');
  console.log('  - 4129111111111111 (İşlem reddedildi)');
  console.log('');
};

const main = async () => {
  console.log('🧪 Iyzico Entegrasyon Test Scripti\n');
  
  testEnvironmentVariables();
  testPaymentFlow();
  
  // if (process.argv.includes('--connection')) {
  //   await testIyzicoConnection();
  // }
  
  console.log('📝 Kullanım:');
  console.log('  node test-iyzico.js --connection  (API bağlantısını test et)');
  console.log('  npm run dev                       (Development server başlat)');
  console.log('');
  console.log('🌐 Test URL\'leri:');
  console.log('  Ana sayfa: http://localhost:3000');
  console.log('  Debug API: http://localhost:3000/api/iyzico/debug');
  console.log('');
};

main().catch(console.error);
