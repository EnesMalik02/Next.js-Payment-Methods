import { NextRequest, NextResponse } from 'next/server';

// Bu endpoint callback URL'lerini test etmek için
export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  try {
    // Test redirect URL'i oluştur
    const testUrl = new URL('/order-result', baseUrl);
    testUrl.searchParams.set('status', 'test');
    testUrl.searchParams.set('message', 'Callback URL test edildi');
    
    console.log('Test callback redirect URL:', testUrl.toString());
    
    return NextResponse.redirect(testUrl.toString());
  } catch (error) {
    console.error('Test callback hatası:', error);
    return NextResponse.json({
      error: 'URL oluşturma hatası',
      baseUrl: baseUrl,
      errorMessage: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  try {
    const body = await request.text();
    console.log('Test POST callback body:', body);
    
    const testUrl = new URL('/order-result', baseUrl);
    testUrl.searchParams.set('status', 'test-post');
    testUrl.searchParams.set('message', 'POST callback test edildi');
    
    return NextResponse.redirect(testUrl.toString());
  } catch (error) {
    console.error('Test POST callback hatası:', error);
    return NextResponse.json({
      error: 'POST test hatası',
      baseUrl: baseUrl,
      errorMessage: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 });
  }
}
