import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Always use Spanish locale - no need for locale detection
  const response = NextResponse.next();
  response.headers.set('x-locale', 'es');
  return response;
}

export const config = {
  // Excluir rutas estáticas y API
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
