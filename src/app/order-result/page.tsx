'use client';

import Link from 'next/link';
import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function OrderResultContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const paymentId = searchParams.get('paymentId');
  const amount = searchParams.get('amount');
  const currency = searchParams.get('currency');
  const message = searchParams.get('message');
  
  useEffect(() => {
    // Başarılı ödemede localStorage'dan sepet verilerini temizle
    if (status === 'success') {
      localStorage.removeItem('cart');
    }
  }, [status]);

  const isSuccess = status === 'success';
  const isFailure = status === 'failure';
  const isError = status === 'error';

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        
        {/* Başarı/Hata İkonu */}
        <div className="mb-6">
          {isSuccess ? (
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : isFailure ? (
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100">
              <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          ) : (
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
              <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
        </div>

        {/* Başlık ve Mesaj */}
        <div className="mb-6">
          <h1 className={`text-2xl font-bold mb-2 ${
            isSuccess ? 'text-green-600' : 
            isFailure ? 'text-yellow-600' : 
            'text-red-600'
          }`}>
            {isSuccess ? 'Ödeme Başarılı!' : 
             isFailure ? 'Ödeme Başarısız!' : 
             'Hata Oluştu!'}
          </h1>
          <p className="text-gray-600">
            {isSuccess 
              ? 'Siparişiniz başarıyla tamamlandı. Kısa süre içinde e-posta adresinize onay mesajı gönderilecektir.'
              : isFailure 
                ? message || 'Ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyiniz.'
                : message || 'Beklenmeyen bir hata oluştu. Lütfen müşteri hizmetleri ile iletişime geçin.'
            }
          </p>
        </div>

        {/* Ödeme Detayları */}
        {(paymentId || amount) && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-2">
            {paymentId && (
              <>
                <p className="text-sm text-gray-600">Ödeme ID:</p>
                <p className="font-mono text-sm font-semibold">{paymentId}</p>
              </>
            )}
            {amount && (
              <>
                <p className="text-sm text-gray-600">Ödenen Tutar:</p>
                <p className="font-semibold text-lg">
                  {parseFloat(amount).toLocaleString('tr-TR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} {currency || 'TRY'}
                </p>
              </>
            )}
          </div>
        )}

        {/* Butonlar */}
        <div className="space-y-3">
          {isSuccess ? (
            <>
              <Link href="/orders">
                <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Siparişlerimi Görüntüle
                </button>
              </Link>
              <Link href="/">
                <button className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                  Alışverişe Devam Et
                </button>
              </Link>
            </>
          ) : (
            <>
              <button 
                onClick={() => window.history.back()}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Tekrar Dene
              </button>
              <Link href="/">
                <button className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                  Ana Sayfaya Dön
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Yardım Linki */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Sorun yaşıyorsanız{' '}
            <a href="mailto:destek@example.com" className="text-blue-600 hover:text-blue-800">
              müşteri hizmetlerimizle iletişime geçin
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}

export default function OrderResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    }>
      <OrderResultContent />
    </Suspense>
  );
}
