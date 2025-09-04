import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (action === 'env-check') {
    return NextResponse.json({
      hasApiKey: !!process.env.IYZICO_API_KEY,
      hasSecretKey: !!process.env.IYZICO_SECRET_KEY,
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
      nodeEnv: process.env.NODE_ENV,
      apiKeyLength: process.env.IYZICO_API_KEY?.length || 0,
      secretKeyLength: process.env.IYZICO_SECRET_KEY?.length || 0
    });
  }

  if (action === 'test-connection') {
    try {
      const { default: iyzipay } = await import('@/lib/iyzico');
      
      // Basit bir API testi
      const testRequest = {
        locale: 'tr',
        conversationId: 'debug-test-' + Date.now()
      };

      return new Promise((resolve) => {
        // Timeout ekle
        const timeout = setTimeout(() => {
          resolve(NextResponse.json({
            status: 'timeout',
            message: 'API çağrısı zaman aşımına uğradı'
          }));
        }, 10000);

        // Test API çağrısı - installment info
        (iyzipay as any).installmentInfo.retrieve(testRequest, (err: any, result: any) => {
          clearTimeout(timeout);
          
          if (err) {
            resolve(NextResponse.json({
              status: 'error',
              error: err,
              message: 'API bağlantı hatası'
            }));
          } else {
            resolve(NextResponse.json({
              status: 'success',
              result: result,
              message: 'API bağlantısı başarılı'
            }));
          }
        });
      });
    } catch (error) {
      return NextResponse.json({
        status: 'error',
        error: error,
        message: 'Iyzico kütüphanesi yüklenemedi'
      });
    }
  }

  return NextResponse.json({
    message: 'Debug API',
    availableActions: ['env-check', 'test-connection'],
    usage: '/api/iyzico/debug?action=env-check'
  });
}
