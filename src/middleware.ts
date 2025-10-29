import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // Lista de locales soportadas
  locales: ['es', 'en'],
  
  // Locale por defecto
  defaultLocale: 'es',
  
  // No añadir el locale al path (mantener URLs limpias)
  localePrefix: 'never'
});

export const config = {
  // Excluir rutas estáticas y API
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
